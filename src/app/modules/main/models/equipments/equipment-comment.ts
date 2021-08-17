import { BaseModel } from '../base-model';

export class EquipmentComment extends BaseModel {
    public comment: string;
    public equipmentId: number;
    public modificationUser: string;

    constructor(){
      super();
    }
}
