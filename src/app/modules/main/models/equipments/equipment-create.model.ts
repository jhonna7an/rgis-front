import { EEquipmentState } from '../EEquipmentState';
import { EEquipmentValoration } from './../EEquipmentValoration.enum';

export class EquipmentCreate {
  public statusId: number;
  public creationDate: Date;
  public creationUserId: number;
  public modificationDate: Date;
  public modificationUserId: number;
  public serial: string;
  public serialFactory: string;
  public inServices: Date;
  public isHold: boolean;
  public modelId: number;
  public branchOfficeId: number;
  public locationId: number;
  public stateId: number;
  public valorationId: number;
  public districtId: number;

  public type: string;
  public brand: string;
  public model: string;
  public district: string;


  public completeCreate(value: any, userId: number): void {
    this.serial = value.serial;
    this.serialFactory = value.serialFactory;
    this.modelId = value.model;
    this.stateId = EEquipmentState.Operative;
    this.valorationId = EEquipmentValoration.Alta;
    this.districtId = value.district;
    this.inServices = value.inService;
    this.modificationDate = new Date();
    this.modificationUserId = userId;
    this.creationDate = new Date();
    this.creationUserId = userId;
  }
}
