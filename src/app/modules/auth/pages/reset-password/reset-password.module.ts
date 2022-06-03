import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password.routing';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../../auth.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ActionResultComponent } from './components/action-result/action-result.component';


@NgModule({
  declarations: [
    ResetPasswordComponent,
    ActionResultComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
    // AuthModule,
    SharedModule
  ]
})
export class ResetPasswordModule { }
