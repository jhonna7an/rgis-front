import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Output, ViewChild, EventEmitter, OnDestroy, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from '../../../../models/equipments/equipment';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { takeUntil } from 'rxjs/operators';
import { MultiEditData } from 'src/app/modules/main/models/pages/equipment-detail';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailComponent } from '../../../dialogs/equipments/dialog-detail/dialog-detail.component';
import { DialogEditComponent } from '../../../dialogs/equipments/dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent extends BaseComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['name', 'model', 'serial', 'districtName', 'location', 'state', 'star'];
  public dataSource: MatTableDataSource<Equipment> = new MatTableDataSource();
  public columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public selection = new SelectionModel<Equipment>(true, []);
  public equipmentsSelected: Equipment[];

  public _equipments: Equipment[];
  public isLoading: boolean;

  @Output() public sendMultiEditEquipment = new EventEmitter<Equipment[]>();
  @Input()
  set equipments(equipments: Equipment[]) {
    if (equipments) {
      this.dataSource.data = equipments;
      this.isLoading = false;
    }
  }

  constructor(
    private equipmentService: EquipmentService,
    private dialog: MatDialog
  ) {
    super();
    this.equipmentsSelected = new Array<Equipment>();
  }

  ngOnInit() {
    this.isLoading = true;

    this.equipmentService.getMultiEditData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: MultiEditData) => {
        if (response.isMultiEditEvent) {
          this.openMultiEditDialog();
        }

        response.isEnableMultiEdit ? this.showMultiEditCol() : this.hideCheckboxCol();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public openDetailDialog(equipment: Equipment): void {
    const multiEditData = new MultiEditData(false, false);
    this.equipmentService.setMultiEditData(multiEditData);
      // const historicInfo = {isHistoricTab: this.tabHandler.isHistoricTab,
      //                       search: this.historicSearch,
      //                       from: this.historicFrom,
      //                       to: this.historicTo};
    const historicInfo = null;
    this.dialog.open(DialogDetailComponent,
      { width: '80%', height: '560px', data: {equipment, historicInfo} });
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
}
