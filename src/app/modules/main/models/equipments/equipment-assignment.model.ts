import { BaseModel } from '../base-model';

export class EquipmentAssignment extends BaseModel {
  public equipmentId: number;
  public startDate: Date;
  public endDate: Date;
  public type: string;
  public typeId: number;
  public employee: string;
  public employeeId: number;
  public location: string;
  public locationId: number;
  public state: string;
  public stateId: number;
}
