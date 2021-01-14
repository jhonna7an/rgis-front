import { BaseModel } from '../base-model';
import { BranchOffice } from '../Manager/branch-office';
import { EquipmentModel } from './equipment-model';
import { EquipmentName } from './equipment-name';
import { EquipmentState } from './equipment-state';
import { EquipmentValoration } from './equipment-valoration';
import { EquipmentComment } from './equipment-comment';
import { Location } from './location';

export class Equipment extends BaseModel{
    public serial: string;
    public nameId: number;
    public modelId: number;
    public branchOfficeId: number;
    public locationId: number;
    public stateId: number;
    public isHold: boolean;
    public valorationId: number;
    public serialFactory: string;
    public inServices: Date;
    public hasNewComment: boolean;

    public branchOffice: BranchOffice;
    public location: Location;
    public model: EquipmentModel;
    public name: EquipmentName;
    public state: EquipmentState;
    public valoration: EquipmentValoration;
    public comments: EquipmentComment[];
}
