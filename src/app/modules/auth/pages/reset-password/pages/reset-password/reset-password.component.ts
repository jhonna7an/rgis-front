import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ResetPassword } from '../../models/reset-password.model';
import { ActionResult } from '../../../../models/action-result.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public actionResult: ActionResult;
  public actionResolved: boolean = false;
  public hide: boolean = true;

  public loading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionResult = new ActionResult();
    this.initForm();

    this.loading$ = this.authService.getLoading();
  }

  public initForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirm_password: ['', [Validators.required, this.matchValues('password')]]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.resetPasswordForm.controls[value];
  }

  public resetPassword(): void {
    this.authService.setLoading(true);

    const resetPassword = new ResetPassword(
      this.resetPasswordForm.controls['password'].value,
      this.resetPasswordForm.controls['confirm_password'].value,
    );

    this.authService
      .resetPassword(resetPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.actionResult.success("Se guardaron los cambios correctamente", '');
      }, error => {
        this.actionResult.failed("Ocurrió un error al intentar procesar la solicitud");
      })
      .add(() =>{
        this.authService.setLoading(true);
        this.actionResolved = true;
      });
  }

  public matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }
}
