import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AuthRouting } from '../auth/auth.routing';
import { RegisterComponent } from './pages/register/register.component';
import { MaterialModule } from 'src/app/material.module';





@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRouting,
    MaterialModule
  ]
})
export class AuthModule { }
