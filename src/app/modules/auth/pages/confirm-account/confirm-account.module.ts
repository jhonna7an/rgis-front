import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { ConfirmAccountRoutingModule } from './confirm-account.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AuthModule } from '../../auth.module';

@NgModule({
  declarations: [
    ConfirmAccountComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ConfirmAccountRoutingModule,
    SharedModule,
    AuthModule
  ]
})
export class ConfirmAccountModule { }
