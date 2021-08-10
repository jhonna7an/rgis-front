import { Equipment } from "../equipments/equipment";

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
        this.disabled = groupCount == 1 ? true : false;
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

export class MultiEditData {
    public isEnableMultiEdit: boolean;
    public isMultiEditEvent: boolean;

    constructor(isEnableMultiEdit: boolean, isMultiEditEvent: boolean){
        this.isEnableMultiEdit = isEnableMultiEdit;
        this.isMultiEditEvent = isMultiEditEvent;
    }
}
