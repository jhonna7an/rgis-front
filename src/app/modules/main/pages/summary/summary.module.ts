import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { SummaryRoutingModule } from './summary.routing';
import { MaterialModule } from 'src/app/modules/shared/material.module';
import { HomeComponent } from './components/home/home.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { SummarySubject } from './subjects/summary.subject';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HomeComponent,
    SummaryComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    SummaryRoutingModule
  ],
  providers: [
    SummarySubject
  ],
  exports: [
  ]
})
export class SummaryModule { }
