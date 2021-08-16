import { BaseComponent } from '../../../../../../core/components/base/base.component';
import { MatTableDataSource } from '@angular/material/table';
import { HistoricEquipment } from './../../../../../models/equipments/historicEquipment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-historic',
  templateUrl: './detail-historic.component.html',
  styleUrls: ['./detail-historic.component.css']
})
export class DetailHistoricComponent extends BaseComponent implements OnInit {

  public displayedColumns: string[] = ['date', 'user'];
  public dataSource: MatTableDataSource<HistoricEquipment>;

  public historics: HistoricEquipment[];
  public historic: HistoricEquipment;
  public showHistoricDetail: boolean;
  public historicMessage: string;

  public loading: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  public getHistoricById = (historic: HistoricEquipment): void => {
    this.historic = historic;
    this.showHistoricDetail = true;
  }

}
