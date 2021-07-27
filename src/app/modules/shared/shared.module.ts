import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterComponent } from './components/footer/footer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from './material.module';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AnimationComponent } from './components/animation/animation.component';



@NgModule({
  declarations: [
    FooterComponent,
    ToolbarComponent,
    LoadingComponent,
    DialogComponent,
    ToastComponent,
    SpinnerComponent,
    AnimationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SharedModule { }
