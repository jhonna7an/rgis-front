import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from '../auth/auth.routing';

import { AuthService } from './services/auth.service';
import { ActionResultComponent } from './components/action-result/action-result.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ActionResultComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    AuthService,
  ],
  exports: [
    ActionResultComponent
  ]
})
export class AuthModule { }
