import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from 'src/app/models/district.model';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { SummarySubject } from '../../subjects/summary.subject';

import { SummaryTable } from '../../models/summarytable';
import { SummaryDetail } from '../../models/summary-detail.model';

import { EquipmentDetail, SummaryDashboard, SummaryItem } from '../../models/summary-dashboard.model';

import * as echarts from 'echarts';
import { MatDialog } from '@angular/material/dialog';

import { DetailChartComponent } from '../dialogs/detail-chart/detail-chart.component';
import { DetailInServicesChartComponent } from '../dialogs/detail-in-services-chart/detail-in-services-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  public titles: string[] = ["name", "count"];
  public name: string;

  public district$: Observable<District>;

  public country: string;
  public sidebarIsShow: boolean;

  public isCountryDetail: boolean = false;
  public isDistrictDetail: boolean = false;

  public dashboard: SummaryDashboard;
  public showByDistrict: boolean = false;
  public showByCountry: boolean = false;

  public summaryData: SummaryTable[];
  public equipments: Equipment[];

  public xpandStatus: boolean;
  public isLoading$: Observable<boolean>;

  constructor(
    private summarySubject: SummarySubject,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.district$ = this.summarySubject.getDistrict();

    this.summarySubject
      .getEquipments()
      .subscribe((response: SummaryDetail) => {
        if (response) {
          if (response.isByDistrict) {
            this.handleDetail('type', 'Equipo', response.equipments);
            setTimeout(() => {
              this.handleChartByPie('type', '#chart-types', 'Equipo', response.equipments);
              this.handleChartByPie('state', '#chart-state', 'Estado', response.equipments);
              this.handleChartByPie('branchOffice', '#chart-location', 'Ubicación', response.equipments);
              this.handleDateInChart('inServices', '#chart-inServices', 'Ingresos', response.equipments);
            }, 100);
            this.isDistrictDetail = true;
          } else {
            this.handleDetail('district', 'Distrito', response.equipments);
            setTimeout(() => {
              this.handleChartByPie('district', '#chart-districts', 'Equipos por distrito', response.equipments);
            }, 100);
          }

          this.equipments = response.equipments;
          this.showByCountry = response.isByCountry;
          this.showByDistrict = response.isByDistrict;
        }
      });

    this.summarySubject
      .getDistrict()
      .subscribe((response: District) => {

      });

    this.isLoading$ = this.summarySubject.getLoading();
  }

  private handleDetail(key: string, title: string, equipments: Equipment[]): void {
    const items: SummaryItem[] = new Array<SummaryItem>();
    this.name = title;

    const grouping = this.getGroupingByKey(key, equipments);

    for (const item in grouping) {
      items.push(new SummaryItem(item, grouping[item].length));
    }

    const detail: EquipmentDetail = new EquipmentDetail(this.titles, items);
    this.dashboard = new SummaryDashboard(detail);
    this.dashboard.total = equipments.length;
    this.dashboard.isHoldCount = equipments.filter(x => x.isHold).length;

    console.log(this.dashboard);
  }

  private getGroupingByKey(key: string, equipments: Equipment[]): any {
    return equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment[key]]: [ ...(result[equipment[key]] || []), equipment ],
    }), {});
  }

  private handleChartByPie(key: string, selector: string, title: string, equipments: Equipment[], groupingByKey?: any, settingChart?: any): void {
    const response = [];
    const grouping = groupingByKey ? groupingByKey(key, equipments) : this.getGroupingByKey(key, equipments);

    for (const item in grouping) {
      response.push({ name: item, value: grouping[item].length });
    }

    settingChart ? settingChart(response, selector, title) : this.settingChart(response, selector, title);
  }

  private handleDateInChart(key: string, selector: string, title: string, equipments: Equipment[]): any {
    const response = [];
    const dateGrouping = this.getGroupingByKey(key, equipments);

    for (const item in dateGrouping) {
      response.push({name: new Date(item).toLocaleDateString(), value: dateGrouping[item].length})
    }

    this.settingLineChart(response.map(x => x.name), response.map(x => x.value), selector, title);
  }

  private settingChart(data: any, selector: string, title: string): void {
    const dom: HTMLElement = document.querySelector(selector);
    const myChart = echarts.init(dom);

    console.log(getComputedStyle(document.documentElement).getPropertyValue('--background-primary'));


    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: '#7a7a7a',
          fontWeight: '500',
          fontSize: 18
        }
      },
      with: '100%',
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          top: '10%',
          left: 'center',
          width: '100%',
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            alignTo: 'edge',
            formatter: '{name|{b}}\n{time|{c} ({d}%)}',
            minMargin: 5,
            edgeDistance: 0,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 0,
            maxSurfaceAngle: 10
          },
          labelLayout: function (params) {
            const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            const points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points
            };
          },
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  }

  public openDetail(key: string): void {
    this.dialog.open(DetailChartComponent, {
      width: '1050px',
      minHeight: '500px',
      data: {
        key,
        equipments: this.equipments,
        groupingByKey: this.getGroupingByKey,
        settingChart: this.settingChart,
        handleChart: this.handleChartByPie
      }
    });
  }

  public openInServicesDetail(): void {
    this.dialog.open(DetailInServicesChartComponent, {
      width: '1050px',
      minHeight: '570px',
      data: {
        equipments: this.equipments,
        groupingByKey: this.getGroupingByKey,
        settingChart: this.settingChart,
        handleChart: this.handleChartByPie
      }
    });
  }

  private settingLineChart(xAxis: any, data: any, selector: string, title: string): void {
    const dom: HTMLElement = document.querySelector(selector);
    const myChart = echarts.init(dom);

    const option = {
      title: {
        text: title,
        left: 'center',
        width: '100%',
        textStyle: {
          color: '#7a7a7a',
          fontWeight: '500',
          fontSize: 18
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true
        }
      ]
    };

    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize();
    };
  }
}
