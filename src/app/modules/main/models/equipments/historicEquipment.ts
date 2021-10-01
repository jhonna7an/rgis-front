import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { BaseModel } from './../base-model';
import { EquipmentOther } from './equipment';
import { BranchOffice } from '../manager/branch-office';
import { EquipmentLocation } from './location';
import { EquipmentState } from './equipment-state';
import { EquipmentValoration } from './equipment-valoration';
import { UserView } from '../manager/userView';

export class HistoricEquipment extends BaseModel {
    public equipment: EquipmentOther;
    public branchOffice: BranchOffice;
    public location: EquipmentLocation;
    public state: EquipmentState;
    public valoration: EquipmentValoration;
    public comments: string[];
    public userView: UserView;
}

export class Historic extends Equipment {
  public badgeId: string;
  public creationUser: string;
  public modificationUser: string;
  public historicCount: number;
  public equipmentId: number;

  constructor(){
    super();
  }
}


export class HistoricDisplay {
    date: Date;
    type: string;
    model: string;
    serial: string;
    district: string;
    location: string;
    state: string;
    historics: Equipment[];

    constructor(historics: Equipment[], historic: Equipment){
        // this.date = new DatePipe('en-US').transform(date, 'MM/dd/yyyy');
        this.date = historic?.creationDate;
        this.type = historic.type;
        this.model = historic.model;
        this.serial = historic.serial;
        this.district = historic.district;
        this.location = historic.location;
        this.state = historic.state;
        this.historics = historics;
    }
}
