import { HistoricData } from 'src/app/modules/main/models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoricService } from '../../../../services/historic.service';
import { Historic, HistoricDisplay, HistoricEquipment } from '../../../../models/equipments/historicEquipment';
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
export class DialogHistoricComponent extends BaseComponent implements OnInit {

  public dataSource: MatTableDataSource<HistoricDisplay>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorHistoric') paginator: MatPaginator;
  public columnsToDisplay = ['date', 'time', 'name', 'model', 'serial', 'district', 'location', 'state', 'star'];
  public expandedElement: HistoricDisplay | null;

  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogHistoricComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoricData,
    private historicService: HistoricService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.historicService.getHistoricsMatched(1, this.data.search, this.data.from, this.data.to)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Historic[]) => {
        console.log(response);

        const historics = this.mapHistoricDisplay(response);
        this.dataSource = new MatTableDataSource(historics);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      }, error => {
        console.log(error);
      });
  }

  private mapHistoricDisplay(historics: Historic[]): HistoricDisplay[] {
    const historicsDisplay = new Array<HistoricDisplay>();
    const historicsDistinct = historics.filter((value, index, array) => array.map(x => x.serial).indexOf(value.serial) === index);

    historicsDistinct.forEach((item: Historic) => {
      const historicsFilter = historics.filter(x => x.serial === item.serial && x.id !== item.id);
      historicsDisplay.push(new HistoricDisplay(historicsFilter, item));
    });

    return historicsDisplay;
  }
}
