import { EEquipmentValoration } from './../EEquipmentValoration.enum';
import { BaseModel } from '../base-model';
import { BranchOffice } from '../manager/branch-office';
import { EquipmentModel } from './equipment-model';
import { EquipmentState } from './equipment-state';
import { EquipmentValoration } from './equipment-valoration';
import { EquipmentComment } from './equipment-comment';
import { EquipmentLocation } from './location';
import { EEquipmentState } from '../EEquipmentState';
import { Historic } from './historicEquipment';

export class EquipmentOther extends BaseModel{
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

export class Equipment extends BaseModel {
  public serial: string;
  public serialFactory: string;
  public inServices: Date;
  public isHold: boolean;
  public type: string;
  public brand: string;
  public model: string;
  public district: string;
  public branchOffice: string;
  public location: string;
  public state: string;
  public valoration: string;

  public typeId: number;
  public modelId: number;
  public districtId: number;
  public branchOfficeId: number;
  public locationId: number;
  public stateId: number;
  public valorationId: number;
  public comments: string[];

  public historicCount: number;

  constructor(){
    super();
  }

  // SE USA PARA COMPLETAR LOS HISTORICOS
  public completeFromEquipment(equipment: Equipment): void{
    this.brand = equipment.brand;
    this.id = equipment.id;
    this.inServices = equipment.inServices;
    this.model = equipment.model;
    this.serial = equipment.serial;
    this.serialFactory = equipment.serialFactory;
    this.type = equipment.type;
  }

  // SE USA PARA COMPLETAR LOS HISTORICOS
  public completeFromHistoric(historic: Historic): void{
    this.branchOffice = historic.branchOffice;
    this.creationDate = historic.creationDate;
    this.creationUserId = historic.creationUserId;
    this.district = historic.district;
    this.isHold = historic.isHold;
    this.location = historic.location;
    this.modificationDate = historic.modificationDate;
    this.modificationUserId = historic.modificationUserId;
    this.state = historic.state;
    this.valoration = historic.valoration;
  }

  public setComments(comments: Array<string>): void {
    this.comments = comments;
  }
}

export class EquipmentAbm extends BaseModel {
    public serial: string;
    public serialFactory: string;
    public inServices: Date;
    public isHold: boolean;
    public modelId: number;
    public branchOfficeId: number;
    public locationId: number;
    public stateId: number;
    public valorationId: number;
    public comments: string[];

    // CREATE
    public districtId: number;

    // CREATE LIST
    public type: string;
    public brand: string;
    public model: string;
    public district: string;

    constructor(equipment?: EquipmentOther, isMultiEdit?: boolean, formData?: any) {
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

    public completeCreate(value: any): void {
      this.serial = value.serial;
      this.serialFactory = value.serialFactory;
      this.modelId = value.model;
      this.stateId = EEquipmentState.Operative;
      this.valorationId = EEquipmentValoration.Alta;
      this.districtId = value.district;
      this.inServices = value.inService;
      this.modificationDate = new Date();
      this.modificationUserId = 1; // TODO: Falta implementacion de login
      this.creationDate = new Date();
      this.creationUserId = 1;
    }

    public completeData(): void {
      this.stateId = EEquipmentState.Operative;
      this.valorationId = EEquipmentValoration.Alta;
      this.modificationUserId = 1; // Falta implementacion de login
      this.modificationDate = new Date();
      this.creationDate = new Date();
      this.creationUserId = 1;
    }

    public completeToEdit(value: any, equipment: Equipment, userId: number): void {
      this.branchOfficeId = value.branchOffice;
      this.creationDate = equipment.creationDate;
      this.creationUserId = equipment.creationUserId;
      this.id = equipment.id;
      this.inServices = equipment.inServices;
      this.isHold = equipment.isHold;
      this.locationId = value.location;
      this.modelId = equipment.modelId;
      this.modificationDate = new Date();
      this.modificationUserId = userId;
      this.serial = equipment.serial;
      this.serialFactory = equipment.serialFactory;
      this.stateId = value.state;
      this.valorationId = value.valoration;
      this.comments = equipment.comments;
    }

    public completeByHoldEvent(addOrRemoveHold: boolean) {
      this.isHold = addOrRemoveHold;
    }
}
