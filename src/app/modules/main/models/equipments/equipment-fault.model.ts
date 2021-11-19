import { BaseModel } from './../base-model';
import { Client } from './client';

export class EquipmentFault extends BaseModel {
  public equipmentId: number;
  public faultDate: Date;
  public clientId: number;
  public store: string;
  public faultDetailId: number;
  public equipmentResponsibleId: number;
  public inventoryLeaderId: number;
  public supervisorId: number;
  public areaManagerId: number;
  public hasFaultSheet: boolean;

  constructor(form: any, equipmentId: number, userId: number, clients: Client[]) {
    super();
    this._completeWithForm(form, equipmentId, userId, clients);
  }

  private _completeWithForm(formValue: any, equipmentId: number, userId: number, clients: Client[]): void {
    this.equipmentId = equipmentId;
    this.faultDate = formValue.date;
    this.store = formValue.store;
    this.faultDetailId = formValue.detail;
    this.equipmentResponsibleId = formValue.leader;
    this.inventoryLeaderId = formValue.leader;
    this.supervisorId = formValue.supervisor;
    this.areaManagerId = formValue.supervisor;
    this.hasFaultSheet = formValue.faultSheet;
    this.creationDate = new Date();
    this.creationUserId = userId;
    this.modificationDate = new Date();
    this.modificationUserId = userId;
    this.statusId = 1;
    this.clientId = clients.find(x => x.clientName.toUpperCase() === formValue.client.toUpperCase()).id;
  }
}
