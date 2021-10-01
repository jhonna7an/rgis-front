import { BaseModel } from '../base-model';

export class EquipmentComment extends BaseModel {
    public comment: string;
    public equipmentId: number;
    public modificationUser: string;

    constructor(){
      super();
    }

    public setByFormToCreate(value: any, equipmentId: number, userId: number): void {
      this.comment = value.comment;
      this.equipmentId = equipmentId;
      this.creationDate = new Date();
      this.creationUserId = userId;
      this.modificationDate = new Date();
      this.modificationUserId = userId;
    }

    public setByFormToEdit(comment: EquipmentComment, value: any, userId: number): void {
      this.id = comment.id;
      this.comment = value.comment;
      this.modificationDate = new Date();
      this.modificationUserId = userId;
      this.creationDate = comment.creationDate;
      this.creationUserId = comment.creationUserId;
      this.equipmentId = comment.equipmentId;
      this.statusId = comment.statusId;
    }
}
