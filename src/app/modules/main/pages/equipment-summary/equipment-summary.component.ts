import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { District } from '../../models/equipments/district';
import { Location } from '../../models/equipments/location';
import { EquipmentState } from '../../models/equipments/equipment-state'
import { Equipment } from '../../models/equipments/equipment';
import { SidebarDetail } from './sidebar-detail';
import { EEquipmentState, SummaryTable, SummaryTableItem } from './summarytable';

import { EEquipmentName } from '../../models/EEquipmentName';

import { EquipmentService } from '../../services/equipment.service';

import * as XLSX from 'xlsx'; 

const districts = [
  {id: 1, label: 'Dist 653'},
  {id: 2, label: 'Dist 654'},
  {id: 3, label: 'Dist 666'},
  {id: 4, label: 'Dist 669'},
  {id: 5, label: 'Dist 684'}
];

const names = [
  {id: 1, label: 'Auditora'},
  {id: 2, label: 'Láser'},
  {id: 3, label: 'Portátil'},
  {id: 4, label: 'Impresora'},
  {id: 5, label: 'Cargador'},
  {id: 6, label: 'Access Point'},
  {id: 7, label: 'Tablet'}
];

@Component({
  selector: 'app-equipment-summary',
  templateUrl: './equipment-summary.component.html',
  styleUrls: ['./equipment-summary.component.css']
})
export class EquipmentSummaryComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx';  
  @ViewChild(MatAccordion) 
  accordion: MatAccordion;
  public countryEquipments: Equipment[];
  public countryDetail: CountryDetail;

  public equipments: Equipment[];
  public districts: District[];
  public locations: Location[];
  public states: EquipmentState[];
  public country: string;
  public sidebarDetail: boolean;

  public sidebarLocations: SidebarDetail[];
  public sidebarStates: SidebarDetail[];
  public summaryData: SummaryTable[];
  public currentDistrict: string;
  
  public xpandStatus: boolean;
  public loading: boolean;

  constructor(private service: EquipmentService) { 
    this.GetEquipments();
    // this.country = 'Argentina';
    this.sidebarDetail = false;
    this.xpandStatus = true;
    this.loading = false;
    this.summaryData = null;
    this.countryDetail = null;
  }

  ngOnInit(): void {
  }

  public GetEquipments(): void {
    this.service.Get().subscribe((response: Equipment[]) => {
      this.countryEquipments = response;
      let dists = response.map(x => x.branchOffice.district);
      this.districts = dists.filter(
        (dist, i, arr) => arr.findIndex(x => x.id === dist.id) === i
      );
    });
  }

  public GetDetail(district: District): void{
    this.loading = true;
    this.countryDetail = null;
    this.service.Get(district.id).subscribe((response: Equipment[]) => {
      this.equipments = response;
      this.currentDistrict = district.districtName;     
      this.sidebarDetail = true;
      this.SetSideBarDetail();
      this.GetBodyContent();
      this.loading = false;
    });
  }

  private SetSideBarDetail(): void{
    this.sidebarLocations = new Array<SidebarDetail>();
    this.sidebarStates = new Array<SidebarDetail>();
    
    var groupedLocation = this.equipments.reduce((result : any, equipment : Equipment) => {
      result[equipment.location.name] = result[equipment.location.name] || []; 
      result[equipment.location.name].push(equipment); 
      return result;
    }, {});

    var groupedStatus = this.equipments.reduce((result : any, equipment : Equipment) => {
      result[equipment.state.state] = result[equipment.state.state] || []; 
      result[equipment.state.state].push(equipment); 
      return result;
    }, {});

    for(var key in groupedLocation){
      var qty = groupedLocation[key].length;
      this.sidebarLocations.push(new SidebarDetail(key, qty));
    }

    for(var key in groupedStatus){
      var qty = groupedStatus[key].length;
      this.sidebarStates.push(new SidebarDetail(key, qty));
    }
  }

  private GetBodyContent(): void{
    this.summaryData = new Array<SummaryTable>();

    var groupByName = this.equipments.reduce((result : any, equipment : Equipment) => {
      result[equipment.name.name] = result[equipment.name.name] || []; 
      result[equipment.name.name].push(equipment); 
      return result;
    }, {});

    for(var name in groupByName){
      var total: number = 0;
      var summaryTable: SummaryTable = new SummaryTable(`${name} - Área N° ${groupByName[name][0].name.area} Inventario de Equipos`, `Total ${name}`);
      
      var groupByModel = groupByName[name].reduce((result : any, equipment : Equipment) => {
        result[equipment.model.model] = result[equipment.model.model] || []; 
        result[equipment.model.model].push(equipment); 
        return result;
      }, {});
      
      for(var model in groupByModel){
        var models: Equipment[] = groupByModel[model].filter(x => x.model.model === model);
        var operative = models.filter(model => model.state.id == EEquipmentState.Operative).length;
        var fault = models.filter(model => model.state.id == EEquipmentState.Averia).length;
        var hold = models.filter(model => model.state.id == EEquipmentState.Hold).length;
        total += models.length;

        var row = new SummaryTableItem(model, operative, fault, hold, models.length);
        summaryTable.items.push(row);
      }

      let operativeTotal = groupByName[name].filter(x => x.state.id === EEquipmentState.Operative).length;
      let faultTotal = groupByName[name].filter(x => x.state.id === EEquipmentState.Averia).length;
      let holdTotal = groupByName[name].filter(x => x.state.id === EEquipmentState.Hold).length;
      
      console.log(operativeTotal);
      
      let totals = new SummaryTableItem(`Total ${name}`, operativeTotal, faultTotal, holdTotal, total);
      summaryTable.items.push(totals);
      summaryTable.total = total;
      this.summaryData.push(summaryTable);
    }
  }

  public CountryDetail(): void {
    this.summaryData = null;
    this.sidebarDetail = false;
    this.currentDistrict = "Argentina";
    this.loading = true;
    let dists = districts.sort((x, y) => x.label > y.label ? 1: -1);
    let filterDistricts = dists.map(x => x.label);
    let filterNames = names.map(x => x.label);
    filterNames.unshift('Distrito');
    this.countryDetail = new CountryDetail(filterNames, filterDistricts);

    for(var district of dists){
      let equipmentByDistrict = this.countryEquipments.filter(x => x.branchOffice.districtId == district.id);
      
      let audits = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Audit).length;
      let lasers = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Laser).length;
      let portatils = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Portatil).length;
      let printers = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Printer).length;
      let charguers = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Charguer).length;
      let accessPoints = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.AccessPoint).length;
      let tablets = equipmentByDistrict.filter(x => x.name.id === EEquipmentName.Tablet).length;
      
      let countryData = new CountryData(district.label, audits, lasers, portatils, printers, charguers, accessPoints, tablets);
      this.countryDetail.data.push(countryData);
      this.loading = false;
    }

    let auditTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Audit).length;
    let laserTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Laser).length;
    let portatilTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Portatil).length;
    let printerTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Printer).length;
    let charguerTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Charguer).length;
    let apTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.AccessPoint).length;
    let tabletTotal = this.countryEquipments.filter(x => x.name.id === EEquipmentName.Tablet).length;

    let total = new CountryData('Total', auditTotal, laserTotal, portatilTotal, printerTotal, charguerTotal, apTotal, tabletTotal);
    this.countryDetail.data.push(total);
  }

  exportexcel(): void {
       /* table id is passed over here */   
       let element = document.getElementById('country-detail'); 
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
  }
}

export class CountryDetail{
  public districts: string[];
  public equipments: string[];
  public data: CountryData[];

  constructor(equipments: string[], districts: string[]){
    this.data = new Array<CountryData>();
    this.equipments = equipments;
    this.districts = districts;
  }
}

export class CountryData{
  public district: string;
  public audit: number;
  public laser: number;
  public portatil: number;
  public printer: number;
  public charguer: number;
  public ap: number;
  public tablet: number;

  constructor(district:string, audit: number, laser: number, portatil: number, printer: number, charguer: number, ap: number, tablet: number){
    this.district = district;
    this.audit = audit;
    this.laser = laser;
    this.portatil = portatil;
    this.printer = printer;
    this.charguer = charguer;
    this.ap = ap;
    this.tablet = tablet;
  }
}