import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './pages/layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutRoutingModule } from './layout.routing';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModule,
    MaterialModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
