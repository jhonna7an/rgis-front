export class RegisterResult {
  message: string;
  icon: string;
  isResultOk: boolean;
  mail: string;
  class: string;

  constructor(){
  }

  public success(mail: string): void {
    this.message = 'El proceso de registro se completó correctamente.';
    this.icon = 'check_circle';
    this.isResultOk = true;
    this.mail = mail;
    this.class = 'success';
  }


  public failed(): void {
    this.message = 'Se produjo un error al intentar procesar la solicitud.';
    this.icon = 'cancel';
    this.isResultOk = false;
    this.class = 'failed';
  }
}
