import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { District } from '../../models/equipments/district';
import { EquipmentLocation } from '../../models/equipments/location';
import { EquipmentState } from '../../models/equipments/equipment-state';
import { Equipment } from '../../models/equipments/equipment';
import { SidebarDetail } from './sidebar-detail';
import { EEquipmentState, SummaryTable, SummaryTableItem } from './summarytable';

import { EEquipmentName } from '../../models/EEquipmentName';

import { EquipmentService } from '../../services/equipment.service';

import * as XLSX from 'xlsx';
import { CountryData, CountryDetail } from '../../models/pages/equipment-summary';
import { EquipmentTypeService } from '../../services/equipment-type.service';
import { EquipmentName } from '../../models/equipments/equipment-name';

const districts = [
  {id: 1, label: 'Dist 653'},
  {id: 2, label: 'Dist 654'},
  {id: 3, label: 'Dist 666'},
  {id: 4, label: 'Dist 669'},
  {id: 5, label: 'Dist 684'}
];

@Component({
  selector: 'app-equipment-summary',
  templateUrl: './equipment-summary.component.html',
  styleUrls: ['./equipment-summary.component.css']
})
export class EquipmentSummaryComponent implements OnInit {

  fileName = 'ExcelSheet.xlsx';
  @ViewChild(MatAccordion)
  accordion: MatAccordion;
  public equipmentsByCountry: Equipment[];
  public countryDetail: CountryDetail;

  public equipments: Equipment[];
  public districts: District[];
  public locations: Location[];
  public states: EquipmentState[];
  public country: string;
  public sidebarIsShow: boolean;
  public homeIsShow: boolean;

  // CURRENT FILTER
  public sidebarLocations: SidebarDetail[];
  public sidebarStates: SidebarDetail[];
  public summaryData: SummaryTable[];
  public currentDistrict: string;

  // COUNTRY DETAIL
  public equipmentTypes: EquipmentName[];

  public xpandStatus: boolean;
  public bodyloading: boolean;
  public sidebarloading: boolean;

  constructor(private service: EquipmentService, private typeService: EquipmentTypeService) {
    this.homeIsShow = true;
    this.GetEquipments();
    // this.country = 'Argentina';
    this.sidebarIsShow = false;
    this.xpandStatus = true;
    this.bodyloading = false;
    this.summaryData = null;
    this.countryDetail = null;
  }

  ngOnInit(): void {
  }

  public GetEquipments(): void {
    const equipment$ = this.service.get()
    // .subscribe((response: Equipment[]) => {
    //   this.equipmentsByCountry = response;
    //   this.districts = response.map(x => x.branchOffice.district).filter((value, i, arr) =>
    //     arr.findIndex(x => x.id === value.id) === i
    //   );
    // });
  }

  public GetDetailByDistrict(district: District): void{
    this.homeIsShow = false;
    this.summaryData = null;
    this.countryDetail = null;
    this.bodyloading = true;
    this.service.get(district.id)
    //   .subscribe((response: Equipment[]) => {
    //     this.equipments = response;
    //     this.currentDistrict = district.districtName;
    //     this.sidebarIsShow = true;
    //     this.SetSideBarDetail();
    //     this.SetBodyDetail();
    //     this.bodyloading = false;
    // });
  }

  private SetSideBarDetail(): void{
    this.sidebarLocations = new Array<SidebarDetail>();
    this.sidebarStates = new Array<SidebarDetail>();

    const locationGrouping = this.equipments.reduce((result: any, equipment: Equipment) => ({
        ...result, [equipment.location.name]: [ ...(result[equipment.location.name] || []), equipment ],
      }), {});

    const stateGrouping = this.equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment.state.state]: [ ...(result[equipment.state.state] || []), equipment ],
    }), {});

    for (const key in locationGrouping) {
      this.sidebarLocations.push(new SidebarDetail(key, locationGrouping[key].length));
    }

    for (const key in stateGrouping) {
      this.sidebarStates.push(new SidebarDetail(key, stateGrouping[key].length));
    }
  }

  private SetBodyDetail(): void {
    this.summaryData = new Array<SummaryTable>();

    const nameGrouping = this.equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment.model.name.name]: [ ...(result[equipment.model.name.name] || []), equipment ],
    }), {});

    for (const name in nameGrouping){
      let total = 0;
      const summaryTable: SummaryTable = new SummaryTable(`${name} - Área N° ${nameGrouping[name][0].name.area} Inventario de Equipos`, `Total ${name}`);

      const modelGrouping = nameGrouping[name].reduce((result: any, equipment: Equipment) => ({
        ...result, [equipment.model.model]: [ ...(result[equipment.model.model] || []), equipment ],
      }), {});

      for (const model in modelGrouping){
        const models: Equipment[] = modelGrouping[model].filter(x => x.model.model === model);
        const operative = models.filter(model => model.state.id == EEquipmentState.Operative).length;
        const fault = models.filter(model => model.state.id == EEquipmentState.Averia).length;
        const hold = models.filter(model => model.state.id == EEquipmentState.Hold).length;
        total += models.length;

        const row = new SummaryTableItem(model, operative, fault, hold, models.length);
        summaryTable.items.push(row);
      }

      const operativeTotal = nameGrouping[name].filter(x => x.state.id === EEquipmentState.Operative).length;
      const faultTotal = nameGrouping[name].filter(x => x.state.id === EEquipmentState.Averia).length;
      const holdTotal = nameGrouping[name].filter(x => x.state.id === EEquipmentState.Hold).length;

      const totals = new SummaryTableItem(`Total ${name}`, operativeTotal, faultTotal, holdTotal, total);
      summaryTable.items.push(totals);
      summaryTable.total = total;
      this.summaryData.push(summaryTable);
    }
  }

  public CountryDetail(): void {
    this.homeIsShow = false;
    this.sidebarIsShow = false;
    this.summaryData = null;
    this.currentDistrict = 'Argentina';
    this.bodyloading = true;
    if (!this.equipmentTypes){
      this.typeService.Get()
      .subscribe((response: EquipmentName[]) => {
        this.equipmentTypes = response;
        this.setCountryDataTable();
      });
    }
    else {
      this.setCountryDataTable();
    }
  }

  private setCountryDataTable(){
    const dists = districts.sort((x, y) => x.label > y.label ? 1 : -1);
    const filterDistricts = dists.map(x => x.label);
    const filterNames = this.equipmentTypes.map(x => x.name);
    filterNames.unshift('Distrito');
    this.countryDetail = new CountryDetail(filterNames, filterDistricts);

    for (const district of dists){
      const equipmentByDistrict = this.equipmentsByCountry.filter(x => x.branchOffice.districtId == district.id);

      const audits = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Audit).length;
      const lasers = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Laser).length;
      const portatils = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Portatil).length;
      const printers = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Printer).length;
      const charguers = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Charguer).length;
      const accessPoints = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.AccessPoint).length;
      const tablets = equipmentByDistrict.filter(x => x.model.name.id === EEquipmentName.Tablet).length;

      const countryData = new CountryData(district.label, audits, lasers, portatils, printers, charguers, accessPoints, tablets);
      this.countryDetail.data.push(countryData);
    }

    const auditTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Audit).length;
    const laserTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Laser).length;
    const portatilTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Portatil).length;
    const printerTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Printer).length;
    const charguerTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Charguer).length;
    const apTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.AccessPoint).length;
    const tabletTotal = this.equipmentsByCountry.filter(x => x.model.name.id === EEquipmentName.Tablet).length;

    const total = new CountryData('Total', auditTotal, laserTotal, portatilTotal, printerTotal, charguerTotal, apTotal, tabletTotal);
    this.countryDetail.data.push(total);
    this.bodyloading = false;
  }

  exportexcel(): void {
       /* table id is passed over here */
       const element = document.getElementById('country-detail');
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
  }
}
