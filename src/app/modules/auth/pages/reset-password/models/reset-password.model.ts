export class ResetPassword {
  public password: string;
  public confirm_password: string;

  constructor(password: string, confirm_password: string) {
    this.password = password;
    this.confirm_password = confirm_password;
  }
}
