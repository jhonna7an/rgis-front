import { BaseModel } from '../base-model';

export interface EquipmentName extends BaseModel {
    name: string;
    area: string;
    chartId: number;
}
