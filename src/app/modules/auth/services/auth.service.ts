import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { Login } from '../pages/login/models/login.model';
import { Register } from '../pages/register/models/register.model';
import { ResetUser } from '../pages/reset-password/models/reset-user.model';

import { UserToken } from '../pages/login/models/user-token.model';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string;
  private partialUrl: string;

  private loading$ = new BehaviorSubject<boolean>(true);
  private isRememberMeChecked$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: ManagerService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.url = `${environment.identity_server}`;
  }

  public setLoading(value: boolean): void {
      this.loading$.next(value);
  }

  public getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  public register(register: Register): Observable<any>{
    this.partialUrl = `${this.url}/api/auth/register`;
    return this.http.post<any>(this.partialUrl, register);
  }

  public login(login: Login): Observable<UserToken>{
    this.partialUrl = `${this.url}/api/auth/login`;
    return this.http.post<UserToken>(this.partialUrl, login);
  }

  public forgotPassword(badgeId: string): Observable<any> {
    this.partialUrl = `${this.url}/api/auth/forgot-password?badgeId=${badgeId}`;
    return this.http.get<any>(this.partialUrl);
  }

  public validTokenReset(token: string, badgeId: string): Observable<ResetUser> {
    this.partialUrl = `${this.url}/api/auth/valid-token-reset?t=${token}&b=${badgeId}`;
    return this.http.get<ResetUser>(this.partialUrl);
  }

  public resetPassword(resetUser: ResetUser): Observable<ResetUser> {
    this.partialUrl = `${this.url}/api/auth/reset-password`;
    return this.http.put<ResetUser>(this.partialUrl, resetUser);
  }

  public confirmAccount(code: string, email: string, badgeId: string): Observable<any> {
    this.partialUrl = `${this.url}/api/auth/confirm-account?code=${code}&m=${email}&b=${badgeId}`;
    return this.http.get<any>(this.partialUrl);
  }

  public setToken(token: string): void {
    localStorage.setItem("access_token", token)
  }

  public getToken(): string {
    return localStorage.getItem("access_token")
  }

  public setUser(response: UserToken) : void {
    localStorage.setItem("user", JSON.stringify({
      id: response.id,
      badgeId: response.badgeId,
      profileFile: response.profileFile,
      countryId: response.countryId
    }));
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  private getTokenValues(): any {
    try {
      const token = this.getToken();
      if (token) {
        return jwt_decode(token);
      }
      this.logout();
    } catch (error) {
      console.log(error);
      this.toastService.showError('El token es inválido');
      throw error;
    }
  }

  // public getRoles(): string[] {
  //   const token = this.getTokenValues();
  //   const roles = token.client_role || [];
  //   return !Array.isArray(roles) ? [roles] : roles;
  // }

  // public getUser() {
  //   const token = this.getTokenValues();
  //   const mail = token.client_mail;
  //   const fullName = token.client_fullName;
  //   return {mail, fullName};
  // }

  public hasExpired(): boolean {
    const token = this.getTokenValues();
    const expiration = new Date(token.exp * 1000);
    const currentDate = new Date();
    return currentDate > expiration;
  }

  public setIsRememberMeChecked(value: boolean): void {
    this.isRememberMeChecked$.next(value);
  }

  public getIsRememberMeChecked(): Observable<boolean> {
    return this.isRememberMeChecked$.asObservable();
  }

  // public showSnakBar(message: string) {
  //   this._snackBar.open(message, 'ok', {
  //     duration: 4000,
  //     horizontalPosition: 'end',
  //     verticalPosition: 'bottom'
  //   });
  //   this.logout();
  // }
}
