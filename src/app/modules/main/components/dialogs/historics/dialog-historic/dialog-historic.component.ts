import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipmentHistoricService } from '../../../../services/equipment-historic.service';
import { HistoricEquipment, HistoricDisplay } from '../../../../models/equipments/historicEquipment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog-historic',
  templateUrl: './dialog-historic.component.html',
  styleUrls: ['./dialog-historic.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DialogHistoricComponent implements OnInit {

  public dataSource: MatTableDataSource<HistoricDisplay>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorHistoric') paginator: MatPaginator;
  public columnsToDisplay = ['date', 'time', 'name', 'model', 'serial', 'district', 'location', 'state', 'star'];
  public expandedElement: HistoricDisplay | null;

  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<DialogHistoricComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private historicService: EquipmentHistoricService) {}

  ngOnInit(): void {
    this.loading = true;
    this.historicService.getHistoricsMatched(1, this.data.search, this.data.from, this.data.to)
      .subscribe((response: HistoricEquipment[]) => {
        const historics = this.mapHistoricDisplay(response);
        this.dataSource = new MatTableDataSource(historics);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      }, error => {
        console.log(error);
      });
  }

  private mapHistoricDisplay = (historics: HistoricEquipment[]): HistoricDisplay[] => {
    const historicsDisplay = new Array<HistoricDisplay>();
    // tslint:disable-next-line: max-line-length
    const historicsDistinct = historics.filter((value, index, array) => array.map(x => x.equipment.serial).indexOf(value.equipment.serial) === index);

    historicsDistinct.forEach((item: HistoricEquipment) => {
      const historicsFilter = historics.filter(x => x.equipment.serial === item.equipment.serial && x.id !== item.id);
      historicsDisplay.push(new HistoricDisplay(historicsFilter, item));
    });

    return historicsDisplay;
  }
}
