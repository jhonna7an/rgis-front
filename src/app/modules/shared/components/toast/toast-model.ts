export class ToastModel {
  public icon: string;
  public class: string;
  public message: string;

  constructor(){
  }

  public success(message: string){
    this.icon = 'check_circle_outline';
    this.class = 'success-toast';
    this.message = message;
  }

  public error(message: string){
    this.icon = 'highlight_off';
    this.class = 'error-toast';
    this.message = message;
  }
}
