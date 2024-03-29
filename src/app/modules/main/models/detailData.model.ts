import { Historic } from './equipments/historicEquipment';
import { Equipment, EquipmentAbm } from './equipments/equipment';

export class DetailData {
  public equipment: Equipment;
  public isEditModule: boolean;
  public isDialogHistoricTab: boolean;

  public isMainHistoricTab: boolean;
  public historicData: HistoricData;

  constructor(isMainHistorictab: boolean, equipment?: Equipment){
    this.equipment = equipment;
    this.isMainHistoricTab = isMainHistorictab;
    this.isDialogHistoricTab = false;
    this.isEditModule = false;
    this.historicData = new HistoricData();
  }

  public changeMainTab(isMainHistoricTab: boolean): void {
    this.isMainHistoricTab = isMainHistoricTab;
    this.historicData.reset();
  }

  public changeDialogTab(current: Equipment, isHistoricTab: boolean): void {
    this.equipment = current;
    this.isDialogHistoricTab = isHistoricTab;
  }

  public CompleteFromHistoric(historic: Historic): void {
    this.equipment = historic;
  }

  public setCommentsToEdit(comments: Array<string>): void {
    // this.equipment.setComments(comments);
    this.equipment.comments = comments;
  }

  public setIsEditModule(value: boolean): void{
    this.isEditModule = value;
  }

  public setEquipmentDetail(equipment: Equipment): void {
    this.equipment = equipment;
  }

  public setHistoricSearch(search: string): void {
    this.historicData.completeSearch(search);
  }

  public setHistoricRange(from: string, to: string): void{
    this.historicData.completeRange(from, to);
  }
}

export class HistoricData {
  public search: string;
  public from: string;
  public to: string;
  public hasHistoricSearch: boolean;

  constructor(){
    this.search = '';
    this.from = '';
    this.to = '';
    this.hasHistoricSearch = false;
  }

  public completeRange(from: string, to: string): void {
    this.reset();
    this.from = from;
    this.to = to;
    this.hasHistoricSearch = true;
  }

  public completeSearch(search: string): void {
    this.reset();
    this.search = search;
    this.hasHistoricSearch = true;
  }

  public reset(): void{
    this.search = '';
    this.from = '';
    this.to = '';
  }
}

export class EditData {
  public equipments: Equipment[];
  public isMultiEdit: boolean;

  constructor(equipments: Equipment[], isMultiEdit: boolean){
    this.equipments = equipments;
    this.isMultiEdit = isMultiEdit;
  }
}

export class EditOneData {
  public isHoldEvent: boolean;
  public addOrRemoveToHold: boolean;
  public equipment: EquipmentAbm;

  constructor(isHoldEvent: boolean){
    this.isHoldEvent = isHoldEvent;
    this.addOrRemoveToHold = false;
  }

  public setAddToHold(){
    this.isHoldEvent = true;
    this.addOrRemoveToHold = true;
  }

  public setRemoveToHold() {
    this.isHoldEvent = true;
    this.addOrRemoveToHold = false;
  }

  public isHold(): boolean {
    return this.addOrRemoveToHold;
  }

  public setEquipment(equipment: EquipmentAbm) {
    this.equipment = equipment;
  }
}

export class EquipmentData {
  public filterApply: string;
  public isHistoricTab: boolean;
  public isBodyEvent: boolean;
  public isSidebarEvent: boolean;
  public equipments: Equipment[];

  constructor(){
    this.isBodyEvent = true;
    this.isSidebarEvent = false;
  }

  public setEventFromBody(equipments: Equipment[], filterApply: string = null): void{
    this.filterApply = filterApply;
    this.isBodyEvent = true;
    this.isSidebarEvent = false;
    this.equipments = equipments;
  }

  public setEventFromSidebar(equipments: Equipment[], isHistoricTab: boolean): void{
    this.isHistoricTab = isHistoricTab;
    this.isBodyEvent = false;
    this.isSidebarEvent = true;
    this.equipments = equipments;
  }
}


// SIDEBAR MODEL
export class FilterData {

  public group: string;
  public value: string;

  constructor(group: string, value: string) {
    this.group = group;
    this.value = value;
  }
}

export class FilterDetail {
  public title: string;
  public items: FilterDetailItem[];
  public disabled: boolean;

  constructor(title: string, items: FilterDetailItem[], groupCount: number) {
      this.title = title;
      this.items = items;
      this.disabled = groupCount === 1 ? true : false;
  }
}

export class FilterDetailItem{
  public name: string;
  public count: number;

  constructor(name: string, count: number) {
      this.name = name;
      this.count = count;
  }
}

export class FilterSend {
  public hasFilter: boolean;
  public hasTypeFilter: boolean;
  public serialFilter: string;

  constructor(hasFilter: boolean, serial: string){
      this.hasFilter = hasFilter;
      this.serialFilter = serial;
  }
}

export class MultiEditData {
  public isEnableMultiEdit: boolean;
  public isMultiEditEvent: boolean;

  constructor(isEnableMultiEdit: boolean, isMultiEditEvent: boolean){
      this.isEnableMultiEdit = isEnableMultiEdit;
      this.isMultiEditEvent = isMultiEditEvent;
  }
}

export class HistoricDataSend {
  public historics: Equipment[];
  public isFirstHistoricCall: boolean;
  public isHistoricTab: boolean;

  constructor(historics: Equipment[], isFirstHistoricCall: boolean, isHistoricTab?: boolean){
      this.historics = historics;
      this.isFirstHistoricCall = isFirstHistoricCall;
  }

  public setHistoricTab(value: boolean): void {
      this.isHistoricTab = value;
  }
}
