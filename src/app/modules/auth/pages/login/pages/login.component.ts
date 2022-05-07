import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { AuthService } from '../../../services/auth.service';

import { Login } from '../models/login.model';
import { environment } from 'src/environments/environment';
import { UserToken } from '../models/user-token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  public loginForm: FormGroup;
  public hide: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.loginForm = this.formBuilder.group({
      badgeId: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ['']
    });
  }

  public getControl(value: string): AbstractControl {
    return this.loginForm.controls[value];
  }

  public login(): void {
    const login = new Login(
      this.loginForm.controls['badgeId'].value,
      this.loginForm.controls['password'].value,
      environment.client_id,
      environment.client_secret,
      environment.scope
    );

    this.authService
      .login(login)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: UserToken) => {
        if(response && response.token){
          this.authService.setToken(response.token.accessToken);
          this.authService.setUser(response);
          this.router.navigate(['/home']);
        }
      }, error => {
        console.log(error);
        this.toastService.showError("Credenciales incorrectas");
      })
  }
}
