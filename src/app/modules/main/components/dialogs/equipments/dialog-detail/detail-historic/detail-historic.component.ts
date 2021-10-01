import { MatSidenav } from '@angular/material/sidenav';
import { DetailData } from './../../../../../models/detailData.model';
import { BaseComponent } from '../../../../../../core/components/base/base.component';
import { MatTableDataSource } from '@angular/material/table';
import { Historic } from './../../../../../models/equipments/historicEquipment';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { HistoricService } from 'src/app/modules/main/services/historic.service';
import { SidenavService } from './../../../../../../shared/services/sidenav.service';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';

@Component({
  selector: 'app-detail-historic',
  templateUrl: './detail-historic.component.html',
  styleUrls: ['./detail-historic.component.css']
})
export class DetailHistoricComponent extends BaseComponent implements OnInit {

  public displayedColumns: string[] = ['date', 'user'];
  public dataSource: MatTableDataSource<Historic>;

  private _detailData: DetailData;
  public historics: Historic[];
  public showHistoricDetail: boolean;
  public historicMessage: string;

  @ViewChild('drawer') public sidenav: MatSidenav;
  public loading: boolean;

  @Input()
  set detailData(value: DetailData) {
    if (value) {
      this._detailData = value;
      const equipmentId = this.isHistoricType(value.equipment) ? value.equipment.equipmentId : value.equipment.id;
      const search = value.historicData.search;
      const from = value.historicData.from;
      const to = value.historicData.to;
      this.historicService.GetByEquipmentId2(equipmentId, search, from, to)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: Historic[]) => {
          this.handleHistoricEquipments(response);
        }, error => {
          console.error(error);
        });
    }
  }

  get detailData(): DetailData {
    return this._detailData;
  }

  constructor(
    private historicService: HistoricService,
    private sidenavService: SidenavService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showHistoricDetail = false;
    this.historicMessage = 'Seleccione un registro para más detalle.';
    this.loading = true;
  }

  ngAfterViewInit(){
    this.sidenavService.setSidenav(this.sidenav);
  }

  public getHistoricById(historic: Historic): void {
    this.loading = true;
    setTimeout(() => {
      this.detailData.CompleteFromHistoric(historic);
      this.showHistoricDetail = true;
      this.loading = false;
    }, 500);
  }

  private handleHistoricEquipments(historics: Historic[]): void {
    this.historics = historics;
    this.dataSource = new MatTableDataSource(historics);
    if (historics.length === 0){
      this.historicMessage = 'No existen datos históricos.';
    }
    this.loading = false;
  }

  private isHistoricType(params: Equipment): params is Historic {
    return (params as Historic).equipmentId !== undefined;
  }
}
