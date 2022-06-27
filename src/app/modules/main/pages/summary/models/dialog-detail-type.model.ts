export class DialogDetailType {
  public name: string;
  public qty: number;
  public subDetail: Array<DialogDetailType>;

  constructor(
    name: string,
    qty: number,
    subDetail?: Array<DialogDetailType>
  ) {
    this.name = name;
    this.qty = qty;
    this.subDetail = subDetail;
  }
}
