import { BaseModel } from '../base-model';
import { EquipmentBrand } from './equipment-brand';
import { EquipmentName } from './equipment-name';

export class EquipmentModel extends BaseModel {
    public model: string;
    public nameId: number;
    public brandId: number;

    public brand: EquipmentBrand;
    public name: EquipmentName;
}
