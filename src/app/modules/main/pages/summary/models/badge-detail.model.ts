import { Equipment } from "../../../models/equipments/equipment";

export class BadgeDetail {
  public name: string;
  public equipments: Equipment[];
  public count: number;

  constructor(name: string, equipments: Equipment[]) {
    this.name = name;
    this.equipments = equipments;
    this.count = equipments.length;
  }
}
