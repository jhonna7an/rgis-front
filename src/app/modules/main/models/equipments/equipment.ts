import { BaseModel } from '../base-model';
import { BranchOffice } from '../manager/branch-office';
import { EquipmentModel } from './equipment-model';
import { EquipmentName } from './equipment-name';
import { EquipmentState } from './equipment-state';
import { EquipmentValoration } from './equipment-valoration';
import { EquipmentComment } from './equipment-comment';
import { EquipmentLocation } from './location';
import { EEquipmentState } from '../EEquipmentState';

export class Equipment extends BaseModel{
    public serial: string;
    public isHold: boolean;
    public serialFactory: string;
    public inServices: Date;
    public hasNewComment: boolean;
    public HistoricCount: number;

    public branchOffice: BranchOffice;
    public location: EquipmentLocation;
    public model: EquipmentModel;
    public state: EquipmentState;
    public valoration: EquipmentValoration;
    public comments: EquipmentComment[];
}

export class EquipmentAbm extends BaseModel {
    public serial: string;
    public modelId: number;
    public branchOfficeId: number;
    public locationId: number;
    public stateId: number;
    public isHold: boolean;
    public valorationId: number;
    public SerialFactory: string;
    public inServices: Date;
    public hasNewComment: boolean;
    public comments: EquipmentComment[];

    constructor(equipment: Equipment, isMultiEdit: boolean, formData: any) {
        super();
        this.id = equipment.id;
        this.modelId = equipment.model.id;
        this.modificationDate = new Date();
        this.modificationUserId = 1; //Falta implementacion de loguin
        this.serial = equipment.serial;
        this.SerialFactory = equipment.serialFactory;
        this.creationDate = equipment.creationDate;
        this.creationUserId = equipment.creationUserId;
        this.comments = new Array<EquipmentComment>();

        if (!isMultiEdit) {
            this.valorationId = formData.valoration;
            this.stateId = formData.state;
            this.locationId = formData.location;
            this.isHold = formData.state === EEquipmentState.Hold ? true : false;
            this.branchOfficeId = formData.branchOffice;
            this.inServices = formData.inservices;
        } else {
            this.valorationId = formData.valoration ? formData.valoration : equipment.valoration.id;
            this.stateId = formData.state ? formData.state : equipment.state.id;
            this.locationId = formData.location ? formData.location : equipment.location.id;
            this.isHold = formData.state === EEquipmentState.Hold ? true : false;
            this.branchOfficeId = formData.branchOffice ? formData.branchOffice : equipment.branchOffice.id;
            this.inServices = formData.inservices;
        }
    }

}
