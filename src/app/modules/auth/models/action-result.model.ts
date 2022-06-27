export class ActionResult {
  public message: string;
  public icon: string;
  public isResultOk: boolean;
  public mail: string;
  public class: string;

  constructor(){
  }

  public success(message: string, icon: string): void {
    this.message = message;
    this.icon = icon;
    this.isResultOk = true;
    this.class = 'success';
  }

  public failed(error: any, icon: string, class_name: string): void {
    this.message = error.message;
    this.icon = icon;
    this.isResultOk = false;
    this.class = class_name;
  }
}
