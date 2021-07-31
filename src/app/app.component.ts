import { ToastModel } from './modules/shared/components/toast/toast-model';
import { ToastService } from './modules/shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './modules/shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'portal-rgis';
  private toast$ = this.toastService.toastModel$;

  constructor(
    private toastService: ToastService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.toast$
      .subscribe(
        (data: ToastModel) => {
          this.snackBar.openFromComponent(ToastComponent, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            data: data,
          });
        }
    );
  }
}
