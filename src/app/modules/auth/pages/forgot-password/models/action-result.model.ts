export class ActionResult {
  public message: string;
  public icon: string;
  public isResultOk: boolean;
  public class: string;

  constructor(){
  }

  public success(message: string): void {
    this.message = message;
    this.icon = 'check_circle';
    this.isResultOk = true;
    this.class = 'success';
  }

  public failed(error: any): void {
    this.message = error.message;
    this.icon = error.status === 500 ? 'cancel' : 'error';
    this.isResultOk = false;
    this.class = error.status === 500 ? 'failed' : 'warning';
  }
}
