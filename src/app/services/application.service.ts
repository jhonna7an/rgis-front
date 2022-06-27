import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from '../modules/auth/pages/login/models/user-token.model';
import { ToastService } from 'src/app/services/toast.service';

import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private router: Router,
    private toastService: ToastService){
  }

  public saveLogin(userToken: UserToken, isRememberMe: boolean) : void {
    const user = JSON.stringify({
      id: userToken.id,
      badgeId: userToken.badgeId,
      profileFile: userToken.profileFile,
      countryId: userToken.countryId
    });

    localStorage.setItem('access_token', userToken.token.accessToken);
    localStorage.setItem('user', user);
    if (isRememberMe) {
    }
  }

  public getByKey(key: string): string {
    return localStorage.getItem(key) as string;
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
    return !!this.getByKey("access_token");
  }

  public logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  public hasExpired(): boolean {
    const token = this._getTokenValues();
    const expiration = new Date(token.exp * 1000);
    const currentDate = new Date();
    return currentDate > expiration;
  }

  private _getTokenValues(): any {
    try {
      const token = this.getByKey("access_token");
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
}
