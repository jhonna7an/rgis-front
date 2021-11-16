import { BaseModel } from '../base-model';

export interface EquipmentType extends BaseModel {
    name: string;
    area: string;
    chartId: number;
}
