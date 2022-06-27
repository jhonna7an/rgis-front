import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ActionResult } from '../../models/action-result.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public mailSended: boolean = false;

  public isLoading: boolean = false;;
  public actionResult: ActionResult;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionResult = new ActionResult();
    this.initForgotPasswordForm();
  }

  public initForgotPasswordForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      badgeId: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(8)
      ]]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.forgotPasswordForm.controls[value];
  }

  public send(): void {
    this.mailSended = true;
    this.isLoading = true;
    const badgeId = this.forgotPasswordForm.controls['badgeId'].value;

    this.authService
      .forgotPassword(badgeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.actionResult.success('Se envió un correo a su casilla de mail');
      }, error => {
        this.actionResult.failed(error);
      })
      .add(() => {
        this.mailSended = true;
        this.isLoading = false;
      });
  }
}
