import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { BadgeDetail } from '../../../models/badge-detail.model';
import { RowItem } from '../../../models/row-item.model';

@Component({
  selector: 'app-detail-in-services-chart',
  templateUrl: './detail-in-services-chart.component.html',
  styleUrls: ['./detail-in-services-chart.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetailInServicesChartComponent implements OnInit {

  public inServices: Array<any>;
  public isEmpty: boolean = true;

  public title: string;
  public badgeDetails: BadgeDetail[] = new Array<BadgeDetail>();
  public itemSelected: any;

  public equipments: Equipment[];
  public groupByKeyFunction: any;
  public settingChartFunction: any;
  public handleChartFunction: any;

  public detailTableTitles: string[] = [ "brand", "count", "expand" ];
  public dataSource: MatTableDataSource<RowItem>;
  public showDetailTable: boolean = false;
  public expandedElement: RowItem | null;
  public filterBrandDetail: Equipment[];


  constructor(
    public dialogRef: MatDialogRef<DetailInServicesChartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupByKeyFunction = data.groupingByKey;
    this.settingChartFunction = data.settingChart;
    this.handleChartFunction = data.handleChart;
    this.equipments = data.equipments;
  }

  ngOnInit(): void {
    this.getInServices();
  }

  public getInServices(): void {
    this.inServices = new Array<any>();
    const inServicesGrouping = this.groupByKeyFunction('inServices', this.equipments);

    for (const item in inServicesGrouping) {
      this.inServices.push({
        name: item,
        id: inServicesGrouping[item][0].inServices
      });
    }
  }

  public openDetail(item: any): void {
    this.itemSelected = item;
    this.isEmpty = false;
    this.badgeDetails = new Array<BadgeDetail>();
    const date = new Date(item.id).toLocaleDateString();

    setTimeout(() => {
      const container = document.querySelector('#detail-container');
      container.innerHTML = '';

      const equipmentFilter = this.equipments.filter(x => x.inServices === item.id);
      this.title = `Detalle ingresos: ${date}`;

      const inServicesGrouping = this.groupByKeyFunction('inServices', equipmentFilter);

      container.innerHTML += '<div class="chart-dialog-container d-flex"></div>'

      let index = 0;
      for (const item in inServicesGrouping) {
        const chartContainer = document.querySelector('.chart-dialog-container');

        const typeGrouping = this.groupByKeyFunction('type', inServicesGrouping[item]);

        for (const key in typeGrouping) {
          this.badgeDetails.push(new BadgeDetail(key, typeGrouping[key]));
        }

        chartContainer.innerHTML += this.getInnerChart(index);
        setTimeout(() => {
          this.handleChartFunction(
            'type',
            `#chart-detail-${index}`,
            date,
            inServicesGrouping[item],
            this.groupByKeyFunction,
            this.settingChartFunction);
            index++;
        }, 100);
      }
    }, 100);
  }

  private getInnerChart(id: number | string): string {
    return `<div class="card-container">
                <div id="chart-detail-${id}" class="card chart animated fadeInUp">
                </div>
            </div>`;
  }

  public showByType(value: BadgeDetail) {
    const detailTable = new Array<RowItem>();
    this.showDetailTable = true;
    const brandGrouping = this.groupByKeyFunction('brand', value.equipments);

    for (const brand in brandGrouping) {
      detailTable.push(new RowItem(brand, brandGrouping[brand]));
    }
    console.log(detailTable);


    this.dataSource = new MatTableDataSource(detailTable);
  }

  public filterByModel(value: any, $event: any) {
    console.log(value);
    // console.log($event);

    (this.expandedElement = this.expandedElement === value ? null : value);
    $event.stopPropagation()
  }
}
