export class Register {
  public name: string;
  public lastName: string;
  public badgeId: string;
  public district: number;
  public branchOfficeId: number;
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(){

  }

  setFirstForm(
    name: string,
    lastName: string,
    badgeId: string,
    branchOffice: number,
    mail: string
  ){
    this.name = name;
    this.lastName = lastName;
    this.badgeId = badgeId;
    this.branchOfficeId = branchOffice;
    this.email = mail;
  }

  setSecondForm(password: string, confirm_password: string){
    this.password = password;
    this.confirmPassword = confirm_password;
  }
}
