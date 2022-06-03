export class ActionResult {
  public message: string;
  public icon: string;
  public isResultOk: boolean;
  public mail: string;
  public class: string;

  constructor(){
  }

  public success(message: string, mail: string): void {
    this.message = message;
    this.icon = 'check_circle';
    this.isResultOk = true;
    this.mail = mail;
    this.class = 'success';
  }

  public failed(error: any): void {
    this.message = error.message;
    this.icon = error.status === 500 ? 'cancel' : 'error';
    this.isResultOk = false;
    this.class = error.status === 500 ? 'failed' : 'warning';
  }
}
