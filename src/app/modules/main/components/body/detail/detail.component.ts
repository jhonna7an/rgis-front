import { TabHandler } from './TabHandler';
import { ETabDetail } from './ETabDetail';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../../../shared/helpers/date-adapter';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
export class DetailComponent extends BaseComponent implements OnInit, OnDestroy {

  public tabHandler: TabHandler;

  @Output() public sendIsHistoricTab = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    // this.dataService.equipment$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((equipments: Equipment[]) => {
    //     this.loading = true;
    //     this.equipments = equipments;
    //     setTimeout(() => this.loading = false, 500);
    //   });


  }

  public changeTab(event: MatTabChangeEvent): void {
    if (event.index === ETabDetail.DETAIL) {
      this.tabHandler = new TabHandler(true, false);
      console.log(this.tabHandler);
    }

    if (event.index === ETabDetail.HISTORIC) {
      this.tabHandler = new TabHandler(false, true);
    }
  }


  //   if (index === ETabDetail.DETAIL) {

  //     // this.loading = true;
  //     // this.isDetailTab = true;
  //     // this.isHistoricTab = false;
  //     // this.isEmptyHistoric = false;
  //   }

  //   if (index === ETabDetail.HISTORIC) {
  //     this.isDetailTab = false;
  //     this.isHistoricTab = true;
  //     this.isEmptyHistoric = true;
  //     this.createHistoricForm();
  //   }

  //   // this.sendIsHistoricTab.emit(this.isHistoricTab);
  // }
}
