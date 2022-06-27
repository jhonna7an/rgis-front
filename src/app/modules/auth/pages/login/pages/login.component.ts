import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from '../../../services/auth.service';

import { Login } from '../models/login.model';
import { environment } from 'src/environments/environment';
import { UserToken } from '../models/user-token.model';

import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  public loginForm: FormGroup;
  public hide: boolean = true;
  public loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    let rememberMe = localStorage.getItem("remember-me");
    if (rememberMe != null) {
      rememberMe = JSON.parse(rememberMe);
    }

    this.loginForm = this.formBuilder.group({
      badgeId: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(8)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      rememberMe: [rememberMe === null ? false : rememberMe]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.loginForm.controls[value];
  }

  public login(): void {
    this.loading = true;

    const login = new Login(
      this.loginForm.controls['badgeId'].value,
      this.loginForm.controls['password'].value,
      this.loginForm.controls['rememberMe'].value,
      environment.client_id,
      environment.client_secret,
      environment.scope
    );

    this.authService
      .login(login)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: UserToken) => {
        if(response && response.token){
          const rememberMe = this.loginForm.controls['rememberMe'].value;
          localStorage.setItem('remember-me', rememberMe);
          this.applicationService.saveLogin(response, rememberMe);
          this.router.navigate(['/home']);
        }
      }, error => {
        console.log(error);
        this.toastService.showError("Credenciales incorrectas");
      })
      .add(() => this.loading = false);
  }
}
