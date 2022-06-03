export class ResetUser {
  id: number;
  fullname: string;
  password: string;

  public setPassword(value: string): void {
    this.password = value;
  }
}
