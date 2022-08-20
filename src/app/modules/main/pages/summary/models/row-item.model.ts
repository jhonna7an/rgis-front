import { Equipment } from "../../../models/equipments/equipment";

export class RowItem {
  public name: string;
  public count: number;
  public equipments: Equipment[];

  constructor(name: string, equipments: Equipment[]) {
    this.name = name;
    this.equipments = equipments;
    this.count = equipments.length;
  }
}
