import { SpinnerInterceptor } from './modules/shared/interceptors/spinner.interceptor';
import { SpinnerComponent } from './modules/shared/components/spinner/spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './modules/core/core.module';

import { MaterialModule } from '../app/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EquipmentModule } from './modules/main/equipment.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    EquipmentModule,
    SharedModule,
    CoreModule,
    AuthModule,
    MaterialModule
  ],
  exports: [
      MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
