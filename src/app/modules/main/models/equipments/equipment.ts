import { EEquipmentValoration } from './../EEquipmentValoration.enum';
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

export interface EquipmentRead extends BaseModel {
  serial: string;
  isHold: boolean;
  serialFactory: string;
  inServices: Date;
  type: string;
  model: string;
  brand: string;
  branchOffice: string;
  district: string;
  location: string;
  state: string;
  stateId: number;
  valoration: string;
  historicCount: number;
}

export class EquipmentAbm extends BaseModel {
    public serial: string;
    public modelId: number;
    public branchOfficeId: number;
    public locationId: number;
    public stateId: number;
    public isHold: boolean;
    public valorationId: number;
    public serialFactory: string;
    public inServices: Date;
    public hasNewComment: boolean;
    public comments: EquipmentComment[];

    //CREATE
    public districtId: number;

    //CREATE LIST
    public type: string;
    public brand: string;
    public model: string;
    public district: string;

    constructor(equipment?: Equipment, isMultiEdit?: boolean, formData?: any) {
        super();
        // this.id = equipment.id;
        // this.modelId = equipment.model.id;
        // this.modificationDate = new Date();
        // this.modificationUserId = 1; //Falta implementacion de login
        // this.serial = equipment.serial;
        // this.SerialFactory = equipment.serialFactory;
        // this.creationDate = equipment.creationDate;
        // this.creationUserId = equipment.creationUserId;
        // this.comments = new Array<EquipmentComment>();

        // if (!isMultiEdit) {
        //     this.valorationId = formData.valoration;
        //     this.stateId = formData.state;
        //     this.locationId = formData.location;
        //     this.isHold = formData.state === EEquipmentState.Hold ? true : false;
        //     this.branchOfficeId = formData.branchOffice;
        //     this.inServices = formData.inservices;
        // } else {
        //     this.valorationId = formData.valoration ? formData.valoration : equipment.valoration.id;
        //     this.stateId = formData.state ? formData.state : equipment.state.id;
        //     this.locationId = formData.location ? formData.location : equipment.location.id;
        //     this.isHold = formData.state === EEquipmentState.Hold ? true : false;
        //     this.branchOfficeId = formData.branchOffice ? formData.branchOffice : equipment.branchOffice.id;
        //     this.inServices = formData.inservices;
        // }
    }

    public completeCreate(value: any){
      this.serial = value.serial;
      this.serialFactory = value.serialFactory;
      this.modelId = value.model;
      this.stateId = EEquipmentState.Operative;
      this.valorationId = EEquipmentValoration.Alta;
      this.districtId = value.district;
      this.inServices = value.inService;
      this.modificationDate = new Date();
      this.modificationUserId = 1; //Falta implementacion de login
      this.creationDate = new Date();
      this.creationUserId = 1;
    }

    public completeData(){
      this.comments = new Array<EquipmentComment>();
      this.stateId = EEquipmentState.Operative;
      this.valorationId = EEquipmentValoration.Alta;
      this.modificationUserId = 1; //Falta implementacion de login
      this.modificationDate = new Date();
      this.creationDate = new Date();
      this.creationUserId = 1;
    }
}
