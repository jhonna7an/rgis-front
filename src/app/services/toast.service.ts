import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ToastModel } from '../models/application/ToastModel.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toast: ToastModel;
  private toastModel$ = new Subject<ToastModel>();

  constructor(){
    this.toast = new ToastModel();
  }

  public showSuccess(message: string): void {
    this.toast.success(message);
    this.toastModel$.next(this.toast);
  }

  public showError(message: string): void {
    this.toast.error(message);
    this.toastModel$.next(this.toast);
  }

  public getToast(): Observable<ToastModel> {
    return this.toastModel$.asObservable();
  }
}
