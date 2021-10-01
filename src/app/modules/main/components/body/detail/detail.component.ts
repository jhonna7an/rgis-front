import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { DetailData } from './../../../models/detailData.model';
import { DetailService } from '../../../services/workflow/detail.service';
import { ETabDetail } from './ETabDetail';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../../../shared/helpers/date-adapter';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DetailComponent extends BaseComponent implements OnInit {

  public detailData: DetailData;

  constructor(
    private detailService: DetailService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.detailData = new DetailData(false);
    this.detailService.setDetailData(this.detailData);
  }

  public changeTab(event: MatTabChangeEvent): void {
    if (event.index === ETabDetail.DETAIL) {
      this.detailData.changeMainTab(false);
    }

    if (event.index === ETabDetail.HISTORIC) {
      this.detailData.changeMainTab(true);
    }

    this.detailService.setDetailData(this.detailData);
  }
}
