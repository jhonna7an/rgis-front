import { Equipment } from '../equipments/equipment';

export class DataInput {
    public equipments: Equipment[];
    public hasFilter: boolean;
    public hasTypeFilter: boolean;

    constructor(equipments: Equipment[], hasFilter: boolean, hasTypeFilter: boolean) {
        this.equipments = equipments;
        this.hasFilter = hasFilter;
        this.hasTypeFilter = hasTypeFilter;
    }

    public setEquipments = (value: Equipment[]) => this.equipments = value;

    public setHasFilter = (value: boolean) => this.hasFilter = value;

    public setHasTypeFilter = (value: boolean) => this.hasTypeFilter = value;
}