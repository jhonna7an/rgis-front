import { BaseModel } from './../base-model';

export class EquipmentFault extends BaseModel {
  public equipmentId: number;
  public faultDate: Date;
  public clientId: number;
  public store: string;
  public faultDetailId: number;
  public inventoryLeaderId: number;
  public supervisorId: number;
  public areaManagerId: number;
  public hasFaultSheet: boolean;
}
