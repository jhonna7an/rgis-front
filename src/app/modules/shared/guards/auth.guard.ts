import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicationService } from 'src/app/services/application.service';

import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private applicationService: ApplicationService,
    private router: Router,
    private toastService: ToastService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise((resolve, reject) => {
        const isLoggedIn: boolean = this.applicationService.isLoggedIn();
         const hasExpired: boolean = this.applicationService.hasExpired();

        if (isLoggedIn && !hasExpired) {
          return resolve(true);
        }
        else {
          if (hasExpired) this.toastService.showError('Su sesión ha expirado');
          this.router.navigate(['/auth/login'])
          return resolve(false);
        }
      });
  }
}
