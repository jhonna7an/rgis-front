import { DetailService } from 'src/app/modules/main/services/workflow/detail.service';
import { DetailData, HistoricData, MultiEditData } from 'src/app/modules/main/models/detailData.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from '../../../../models/equipments/equipment';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailComponent } from '../../../dialogs/equipments/dialog-detail/dialog-detail.component';
import { DialogEditComponent } from '../../../dialogs/equipments/dialog-edit/dialog-edit.component';
import { CreateAssignmentComponent } from '../../../dialogs/equipments/create-asignation/create-assignment.component';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent extends BaseComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['name', 'model', 'serial', 'brand', 'districtName', 'location', 'state', 'star'];
  public dataSource: MatTableDataSource<Equipment> = new MatTableDataSource();
  public columnsToDisplay: string[] = this.displayedColumns.slice();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public selection = new SelectionModel<Equipment>(true, []);
  public equipmentsSelected: Equipment[];

  private _detailData: DetailData;
  public _equipments: Equipment[];
  public _historicData: HistoricData;

  public isLoading: boolean;

  @Input()
  set equipments(value: Equipment[]) {
    if (value) {
      this._equipments = value;
      this.dataSource.data = value;
      this.detailService.setLoading(false);
    }
  }

  get equipments(): Equipment[]{
    return this._equipments;
  }

  @Input()
  set detailData(value: DetailData) {
    if (value) {
      this._detailData = value;
    }
  }

  get detailData(): DetailData {
    return this._detailData;
  }

  @Input()
  set serialFilter(value: Event){
    console.log(value);

    if (value) {
      const filterValue = (value.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  constructor(
    public detailService: DetailService,
    private equipmentService: EquipmentService,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef
  ) {
    super();
    this.equipmentsSelected = new Array<Equipment>();
  }

  ngOnInit(): void {
    this.equipmentService.getMultiEditData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: MultiEditData) => {
        if (response.isMultiEditEvent) {
          this.openMultiEditDialog();
        }

        response.isEnableMultiEdit ? this.showMultiEditCol() : this.hideCheckboxCol();
      });

    this.detailService.getLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        this.isLoading = response;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  public openDetailDialog(equipment: Equipment): void {
    const multiEditData = new MultiEditData(false, false);
    this.equipmentService.setMultiEditData(multiEditData);

    this.detailData.setEquipmentDetail(equipment);
    this.dialog.open(DialogDetailComponent,
      { width: '80%', data: this.detailData });
  }

  public openMultiEditDialog(): void {
    this.dialog.open(DialogEditComponent,
      { width: '35%', data: { equipments: this.equipmentsSelected, isMultiEdit: true }});

    const multiEditData = new MultiEditData(false, false);
    this.equipmentService.setMultiEditData(multiEditData);
  }

  // Handler Checkbox Column
  public selectRow($event: any, equipment: Equipment): void {
    this.selection.toggle(equipment);
    if ($event.checked) {
      this.equipmentsSelected.push(equipment);
    } else {
      const index = this.equipmentsSelected.indexOf(equipment);
      if (index !== -1) {
        this.equipmentsSelected.splice(index, 1);
      }
    }
  }

  public showMultiEditCol(): void{
    const index = this.columnsToDisplay.indexOf('select');
    if (index === -1) {
      this.columnsToDisplay.splice(0, 0, 'select');
    }
  }

  public hideCheckboxCol(): void {
    this.selection.clear();
    this.resetEquipmentsSelected();
    if (this.columnsToDisplay.length) {
      const index = this.columnsToDisplay.indexOf('select');
      if (index !== -1) {
        this.columnsToDisplay.splice(index, 1);
      }
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.equipmentsSelected.splice(0, this.equipmentsSelected.length);
    if (this.isAllSelected()){
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.equipmentsSelected.push(row);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  public checkboxLabel(row?: Equipment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  public resetEquipmentsSelected(): void{
    this.equipmentsSelected = new Array<Equipment>();
  }

  public multiChoiceSelect(equipment: Equipment): void{
    this.equipmentService.setMultiChoiceEquipment(equipment);
  }

  public assignEquipment(equipment: Equipment): void{
    this.dialog.open(CreateAssignmentComponent,
      { width: '30%', data: equipment });
  }
}
