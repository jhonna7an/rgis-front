import { ToastModel } from './modules/shared/components/toast/toast-model';
import { ToastService } from './services/toast.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './modules/shared/components/toast/toast.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public title = 'portal-rgis';
  private toastSubscription$ = new Subscription();

  constructor(
    private toastService: ToastService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.toastSubscription$ = this.toastService
      .getToast()
      .subscribe((response: ToastModel) => {
        this.snackBar.openFromComponent(ToastComponent, {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          data: response,
        });
      }, error => console.log(error))
      .add(() => console.log('Add'));
  }

  ngOnDestroy() {
    this.toastSubscription$.unsubscribe();
  }
}
