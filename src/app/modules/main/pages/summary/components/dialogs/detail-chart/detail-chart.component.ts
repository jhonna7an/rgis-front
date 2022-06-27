import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';

@Component({
  selector: 'app-detail-chart',
  templateUrl: './detail-chart.component.html',
  styleUrls: ['./detail-chart.component.css']
})
export class DetailChartComponent implements OnInit {

  public isEmpty: boolean = true;
  public types: Array<any>;

  public equipments: Equipment[];
  public groupByKeyFunction: any;
  public settingChartFunction: any;
  public handleChartFunction: any;

  constructor(
    public dialogRef: MatDialogRef<DetailChartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupByKeyFunction = data.groupingByKey;
    this.settingChartFunction = data.settingChart;
    this.handleChartFunction = data.handleChart;
    this.equipments = data.equipments;
  }

  ngOnInit(): void {
    this.getTypes();
  }

  public getTypes(): void {
    this.types = new Array<any>();
    const typeGrouping = this.groupByKeyFunction('type', this.equipments);
    console.log(typeGrouping);

    for (const type in typeGrouping) {
      this.types.push({
        name: type,
        id: typeGrouping[type][0].typeId
      });
    }
  }

  public openDetail(item: any): void {
    this.isEmpty = false;

    setTimeout(() => {
      const container = document.querySelector('#detail-container');
      container.innerHTML = '';

      const equipmentFilter = this.equipments.filter(x => x.typeId === item.id);
      container.innerHTML += this.getInnerTotal(equipmentFilter.length, item.name);

      const brandGrouping = this.groupByKeyFunction('brand', equipmentFilter);

      container.innerHTML += '<div class="chart-dialog-container d-flex"></div>'

      for (const brand in brandGrouping) {
        const chartContainer = document.querySelector('.chart-dialog-container');

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
    }, 100);
  }

  private getInnerTotal(total: number, type: string): string {
    return `<div class="total-dialog-container">
                <div class="detail animated fadeInUp">
                    <span class="card-title">
                        Total ${type}s:
                    </span>

                    <span class="card-title">
                        ${total}
                    </span>
                </div>
            </div>`;
  }

  private getInnerChart(id: string): string {
    return `<div class="card-container">
                <div id="chart-detail-${id}" class="card chart animated fadeInUp">
                </div>
            </div>`;
  }
}
