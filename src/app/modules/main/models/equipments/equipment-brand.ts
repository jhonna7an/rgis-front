import { EquipmentModel } from './equipment-model';
import { BaseModel } from '../base-model';

export class EquipmentBrand extends BaseModel{
    public brand: string;
    public models: EquipmentModel[];
}
