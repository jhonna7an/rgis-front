import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from '../../models/equipments/equipment';
import { DataService } from '../../services/data.service';
import { MultiEditData } from '../../models/pages/equipment-detail';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['name', 'model', 'serial', 'districtName', 'location', 'state', 'star'];
  public dataSource: MatTableDataSource<Equipment>;
  public selection = new SelectionModel<Equipment>(true, []);
  public columnsToDisplay: string[] = this.displayedColumns.slice();
  public showMultiEditColumn: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public multiEditCollection: Equipment[];
  public multiEditSubscription: Subscription;

  @Input()
  public set data(value: Equipment[]){
    if (value) {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  @Output() public sendEquipmentInfo = new EventEmitter<Equipment>();
  @Output() public sendMultiEditEquipment = new EventEmitter<Equipment[]>();

  constructor(private dataService: DataService) {
    this.multiEditCollection = new Array<Equipment>();
  }

  ngOnInit(): void {
    this.multiEditSubscription = this.dataService.multiEditEquipments$
      .subscribe((data: MultiEditData) => {
        if (data.isMultiEditEvent) {
          this.showMultiEditCol();
        } else {
          this.hideCheckboxCol();
        }

        if (data.getMultiEditData) {
          this.openMultiEditDialog();
        }
      });
  }

  ngOnDestroy(): void {
    this.multiEditSubscription.unsubscribe();
  }

  public selectRow($event: any, equipment: Equipment): void {
    this.selection.toggle(equipment);
    if ($event.checked) {
      this.multiEditCollection.push(equipment);
    } else {
      const index = this.multiEditCollection.indexOf(equipment);
      if (index !== -1) {
        this.multiEditCollection.splice(index, 1);
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
    this.multiEditCollection = new Array<Equipment>();
    if (this.columnsToDisplay.length) {
      const index = this.columnsToDisplay.indexOf('select');
      if (index !== -1) {
        this.columnsToDisplay.splice(index, 1);
      }
    }
  }

  public openDetailDialog(equipment: Equipment): void {
    this.sendEquipmentInfo.emit(equipment);
  }

  public openMultiEditDialog(): void {
    const multiEditData = new MultiEditData(false, false, this.multiEditCollection);
    this.dataService.multiEditEquipments$.emit(multiEditData);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.multiEditCollection.splice(0, this.multiEditCollection.length);
    if (this.isAllSelected()){
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.multiEditCollection.push(row);
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
}
