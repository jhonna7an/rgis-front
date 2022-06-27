import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ActionResult } from '../../models/action-result.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetUser } from '../../models/reset-user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public actionResult: ActionResult;
  public password_hide: boolean = true;
  public confirm_hide: boolean = true;

  public loading$: Observable<boolean>;
  public loadingMessage: string;

  public hasResolved: boolean = false;

  private _resetUser: ResetUser;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionResult = new ActionResult();

    this.loading$ = this.authService.getLoading();
    this.loadingMessage = 'Procesando la solicitud, por favor espere...';

    this.route.queryParams
      .subscribe(params => {
        const token = params.t;
        const badgeId = params.b

        this.validToken(token, badgeId);
      });

    this.initForm();
  }

  public initForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirm_password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.matchValues('password')]]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.resetPasswordForm.controls[value];
  }

  public validToken(token: string, badgeId: string): void {
    this.authService
      .validTokenReset(token, badgeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: ResetUser) => {
        this._resetUser = response;
      }, error => {
        console.log(error);
        this.actionResult.failed(error);
        console.log(this.actionResult);

        this.hasResolved = true;
      })
      .add(() =>{
        this.authService.setLoading(false);
      });
  }

  public resetPassword(): void {
    this.authService.setLoading(true);
    this.loadingMessage = 'Guardando los cambios, por favor espere...';
    this._resetUser.password = this.resetPasswordForm.controls['password'].value;

    this.authService
      .resetPassword(this._resetUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actionResult.success("Se guardaron los cambios correctamente");
      }, error => {
        this.actionResult.failed(error);
      })
      .add(() => {
        this.authService.setLoading(false);
        this.hasResolved = true;
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

  public goLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 800);
  }
}
