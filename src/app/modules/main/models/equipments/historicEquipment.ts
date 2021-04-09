import { Equipment } from './equipment';
import { BranchOffice } from '../manager/branch-office';
import { EquipmentLocation } from './location';
import { EquipmentState } from './equipment-state';
import { EquipmentValoration } from './equipment-valoration';
import { UserView } from '../manager/userView';
import { BaseModel } from '../base-model';
import { DatePipe } from '@angular/common';
import { District } from './district';

export class HistoricEquipment extends BaseModel {
    public equipment: Equipment;
    public branchOffice: BranchOffice;
    public location: EquipmentLocation;
    public state: EquipmentState;
    public valoration: EquipmentValoration;
    public comments: string[];
    public userView: UserView;
}

export class HistoricDisplay {
    date: Date;
    type: string;
    model: string;
    serial: string;
    district: string;
    location: string;
    state: string;
    historics: HistoricEquipment[];

    constructor(historics: HistoricEquipment[], historic: HistoricEquipment){
        // this.date = new DatePipe('en-US').transform(date, 'MM/dd/yyyy');
        this.date = historic?.creationDate;
        this.type = historic.equipment.model.name.name;
        this.model = historic.equipment.model.model;
        this.serial = historic.equipment.serial;
        this.district = historic.branchOffice.district.districtName;
        this.location = historic.location.name;
        this.state = historic.state.state;
        this.historics = historics;
    }
}
