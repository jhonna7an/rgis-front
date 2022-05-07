import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { RegisterRoutingModule } from './register.routing';
import { RegisterMessageComponent } from './components/register-message/register-message.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterMessageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    SharedModule
  ]
})
export class RegisterModule { }
