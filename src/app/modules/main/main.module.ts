import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { EquipmentSummaryComponent } from './pages/equipment-summary/equipment-summary.component';
import { HomeComponent } from './pages/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { MaterialModule } from './material.module';

import { EquipmentService } from './services/equipment.service';
import { ManagerService } from './services/manager.service';
import { LoadingComponent } from './components/loading/loading.component';
import { EquipmentDetailComponent } from './pages/equipment-detail/equipment-detail.component';
import { SidebarFilterItemComponent } from './components/sidebar/sidebar-filter-item/sidebar-filter-item.component';
import { SidebarComponent } from './components/sidebar/sidebar/sidebar.component';
import { ContentComponent } from './components/body/equipment/content/content.component';
import { DialogDetailComponent } from './components/dialogs/equipments/dialog-detail/dialog-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogEditComponent } from './components/dialogs/equipments/dialog-edit/dialog-edit.component';
import { LocationService } from './services/location.service';
import { EquipmentStateService } from './services/equipment-state.service';
import { EquipmentValorationService } from './services/equipment-valoration.service';
import { BranchOfficeService } from './services/branch-office.service';
import { EquipmentHistoricService } from './services/equipment-historic.service';
import { AccentPipe } from './pipes/accent.pipe';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { UserService } from './services/user.service';
import { DialogHistoricComponent } from './components/dialogs/historics/dialog-historic/dialog-historic.component';
import { DataService } from './services/data.service';
import { CreateEquipmentComponent } from './pages/create-equipment/create-equipment.component';
import { BrandService } from './services/brand.service';
import { ModelService } from './services/model.service';

@NgModule({
  declarations: [
    FooterComponent,
    EquipmentSummaryComponent,
    HomeComponent,
    ToolbarComponent,
    LoadingComponent,
    EquipmentDetailComponent,
    SidebarFilterItemComponent,
    SidebarComponent,
    ContentComponent,
    DialogDetailComponent,
    DialogEditComponent,
    AccentPipe,
    DatatableComponent,
    DateAgoPipe,
    DialogHistoricComponent,
    CreateEquipmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    EquipmentService,
    ManagerService,
    LocationService,
    EquipmentStateService,
    EquipmentValorationService,
    BranchOfficeService,
    EquipmentHistoricService,
    UserService,
    DataService,
    BrandService,
    ModelService
  ],
  bootstrap: []
})
export class MainModule { }
