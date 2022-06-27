export class Login {
  public badgeId: string;
  public password: string;
  public keepSession: boolean;
  public clientId: string;
  public clientSecret: string;
  public scope: string;

  constructor(badgeId: string, password: string, keepSession: boolean, clientId: string, clientSecret: string, scope: string){
    this.badgeId = badgeId;
    this.password = password;
    this.keepSession = keepSession;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
  }
}
