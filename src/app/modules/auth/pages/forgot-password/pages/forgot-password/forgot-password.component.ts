import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ForgotPassword } from '../../models/forgot-password.model';
import { SendMailResult } from '../../models/send-mail-result.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

  public forgotPasswrodForm: FormGroup;
  public mailSended: boolean = false;

  public mailResult: SendMailResult;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.mailResult = new SendMailResult();
    this.initForgotPasswordForm();
  }

  public initForgotPasswordForm(): void {
    this.forgotPasswrodForm = this.formBuilder.group({
      mail: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.forgotPasswrodForm.controls[value];
  }

  public send(): void {
    const forgotPassword = new ForgotPassword(this.forgotPasswrodForm.controls['mail'].value);

    this.authService
      .forgotPassword(forgotPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.mailResult.success(forgotPassword.mail);
      }, error => {
        console.error(error);
        this.mailResult.failed();
      })
      .add(() => this.mailSended = true);
  }

}
