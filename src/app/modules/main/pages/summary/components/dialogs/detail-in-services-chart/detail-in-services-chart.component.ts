import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';

@Component({
  selector: 'app-detail-in-services-chart',
  templateUrl: './detail-in-services-chart.component.html',
  styleUrls: ['./detail-in-services-chart.component.css']
})
export class DetailInServicesChartComponent implements OnInit {

  public inServices: Array<any>;
  public isEmpty: boolean = true;

  public title: string;
  public filters: string[] = new Array<string>();
  public itemSelected: any;

  public equipments: Equipment[];
  public groupByKeyFunction: any;
  public settingChartFunction: any;
  public handleChartFunction: any;

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
    this.filters = new Array<string>();
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
          this.filters.push(key)
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

  public showByType(type: string) {
    const container = document.querySelector('#filter-container');

    const inServicesFilter = this.equipments.filter(x => x.inServices === this.itemSelected.id);
    const typeFilter = inServicesFilter.filter(x => x.type === type);

    const brandGrouping = this.groupByKeyFunction('brand', typeFilter);

    container.innerHTML += '<div class="chart-dialog-container filter d-flex"></div>'

    for (const brand in brandGrouping) {
      const chartContainer = document.querySelector('.filter');
      console.log(chartContainer);


      chartContainer.innerHTML += this.getInnerChart(brand);
      setTimeout(() => {
        this.handleChartFunction(
          'model',
          `#chart-detail-${brand}`,
          brand,
          brandGrouping[brand],
          this.groupByKeyFunction,
          this.settingChartFunction);
      }, 100);
    }
  }
}
