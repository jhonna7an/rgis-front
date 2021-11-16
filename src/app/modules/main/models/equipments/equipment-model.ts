import { BaseModel } from '../base-model';
import { EquipmentBrand } from './equipment-brand';
import { EquipmentType } from './equipment-type';

export class EquipmentModel extends BaseModel {
    public model: string;
    public nameId: number;
    public brandId: number;

    public brand: EquipmentBrand;
    public name: EquipmentType;
}
