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
import { DetailTypeComponent } from './components/dialogs/detail-type/detail-type.component';
import { DetailChartComponent } from './components/dialogs/detail-chart/detail-chart.component';
import { DetailInServicesChartComponent } from './components/dialogs/detail-in-services-chart/detail-in-services-chart.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HomeComponent,
    SummaryComponent,
    HeaderComponent,
    DetailTypeComponent,
    DetailChartComponent,
    DetailInServicesChartComponent
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
