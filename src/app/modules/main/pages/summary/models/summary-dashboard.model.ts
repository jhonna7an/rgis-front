export class SummaryDashboard {
  public total: number;
  public detail: EquipmentDetail;
  public isHoldCount: number

  constructor(detail: EquipmentDetail) {
    this.detail = detail;
  }
}

export class EquipmentDetail {
  public titles: string[];
  public items: SummaryItem[];

  constructor(
    titles: string[],
    items: SummaryItem[]
  ){
    this.titles = titles;
    this.items = items;
  }
}

export class SummaryItem {
  public type: string;
  public count: number;

  constructor(type: string, count: number) {
    this.type = type;
    this.count = count;
  }
}
