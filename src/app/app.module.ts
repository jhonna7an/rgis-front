import { SpinnerInterceptor } from './modules/shared/interceptors/spinner.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CoreModule } from './modules/core/core.module';

import { MaterialModule } from '../app/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './modules/shared/shared.module';
import { CommonModule } from '@angular/common';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ApplicationService } from './services/application.service';
import { ToastService } from './services/toast.service';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    MaterialModule
  ],
  exports: [
      MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "es" },
    ApplicationService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
