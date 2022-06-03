import { Equipment } from '../../../models/equipments/equipment';

export class SummaryDetail {
  public equipments: Equipment[];
  public isByDistrict: boolean;
  public isByCountry: boolean;

  constructor(equipments: Equipment[]) {
    this.equipments = equipments;
    this.isByCountry = false;
    this.isByDistrict = false;
  }

  public setByDistrict(): void {
    this.isByDistrict = true;
  }

  public setByCountry(): void {
    this.isByCountry = true;
  }
}
