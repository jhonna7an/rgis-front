import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { LoginRoutingModule } from './login.routing';
import { LoginComponent } from './pages/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
      LoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
