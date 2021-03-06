import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from './material.module';
import { ToastComponent } from './components/toast/toast.component';



@NgModule({
  declarations: [
    FooterComponent,
    ToolbarComponent,
    LoadingComponent,
    DialogComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
