import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ConnectableObservable, Observable } from 'rxjs';
import { District } from 'src/app/models/district.model';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { SummarySubject } from '../../subjects/summary.subject';

import { SummaryTable, SummaryTableItem } from '../../models/summarytable';
import { EEquipmentState } from 'src/app/modules/main/models/EEquipmentState';
import { SummaryDetail } from '../../models/summary-detail.model';

import { EquipmentDetail, SummaryDashboard, SummaryItem } from '../../models/summary-dashboard.model';

import * as echarts from 'echarts';


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

  // CURRENT FILTER
  public summaryData: SummaryTable[];

  // COUNTRY DETAIL
  // public equipmentTypes: EquipmentType[];

  public xpandStatus: boolean;
  public bodyloading: boolean;
  public isLoading$: Observable<boolean>;

  constructor(
    private summarySubject: SummarySubject
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
              this.handleChartByPie('location', '#chart-location', 'Ubicación', response.equipments);
            }, 100);
            this.isDistrictDetail = true;
          } else {
            this.handleDetail('district', 'Distrito', response.equipments);
            setTimeout(() => {
              this.handleChartByPie('district', '#chart-districts', 'Equipos por distrito', response.equipments);
            }, 100);
          }

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
  }

  private getGroupingByKey(key: string, equipments: Equipment[]): any {
    return equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment[key]]: [ ...(result[equipment[key]] || []), equipment ],
    }), {});
  }

  private handleChartByPie(key: string, selector: string, title: string, equipments: Equipment[]): void {
    const response = [];
    const grouping = this.getGroupingByKey(key, equipments);

    for (const item in grouping) {
      response.push({ name: item, value: grouping[item].length });
    }

    console.log(response);


    this.settingChart(response, selector, title);
  }





  private setDetail(equipments: Equipment[]): void {
    this.summaryData = new Array<SummaryTable>();

    const typeGrouping = equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment.type]: [ ...(result[equipment.type] || []), equipment ],
    }), {});

    for (const name in typeGrouping){
      console.log(typeGrouping[name].length);

      console.log(typeGrouping[name][0]);
      let total = 0;
      const summaryTable: SummaryTable = new SummaryTable(`${name} - Área N° ${typeGrouping[name][0].type} Inventario de Equipos`, `Total ${name}`);

      const modelGrouping = typeGrouping[name].reduce((result: any, equipment: Equipment) => ({
        ...result, [equipment.model]: [ ...(result[equipment.model] || []), equipment ],
      }), {});

      for (const model in modelGrouping){
        const models: Equipment[] = modelGrouping[model].filter(x => x.model.model === model);
        const operative = models.filter(model => model.stateId == EEquipmentState.Operative).length;
        const fault = models.filter(model => model.stateId == EEquipmentState.Averia).length;
        const hold = models.filter(model => model.stateId == EEquipmentState.Hold).length;
        total += models.length;

        const row = new SummaryTableItem(model, operative, fault, hold, models.length);
        summaryTable.items.push(row);
      }

      const operativeTotal = typeGrouping[name].filter(x => x.state.id === EEquipmentState.Operative).length;
      const faultTotal = typeGrouping[name].filter(x => x.state.id === EEquipmentState.Averia).length;
      const holdTotal = typeGrouping[name].filter(x => x.state.id === EEquipmentState.Hold).length;

      const totals = new SummaryTableItem(`Total ${name}`, operativeTotal, faultTotal, holdTotal, total);
      summaryTable.items.push(totals);
      summaryTable.total = total;
      this.summaryData.push(summaryTable);
    }
  }

  private settingChart(data: any, selector: string, title: string): void {
    const dom: HTMLElement = document.querySelector(selector);
    const myChart = echarts.init(dom);

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: '#999',
          fontWeight: 'normal',
          fontSize: 14
        }
      },
      with: '100%',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          width: '100%',
          radius: '80%',
          top: '10%',
          left: 'center',
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
}
