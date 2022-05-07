export class Login {
  public badgeId: string;
  public password: string;
  public clientId: string;
  public clientSecret: string;
  public scope: string;

  constructor(badgeId: string, password: string, clientId: string, clientSecret: string, scope: string){
    this.badgeId = badgeId;
    this.password = password;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
  }
}
