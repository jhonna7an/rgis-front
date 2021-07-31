import { SpinnerService } from '../shared/services/spinner.service';
import { EquipmentNameService } from './services/equipment-name.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from '../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './components/footer/footer.component';
import { EquipmentSummaryComponent } from './pages/summary/equipment-summary.component';
import { HomeComponent } from './pages/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EquipmentDetailComponent } from './pages/detail/equipment-detail.component';
import { SidebarFilterItemComponent } from './components/sidebar/sidebar-filter-item/sidebar-filter-item.component';
import { SidebarComponent } from './components/sidebar/sidebar/sidebar.component';
import { ContentComponent } from './components/body/equipment/content/content.component';
import { DialogDetailComponent } from './components/dialogs/equipments/dialog-detail/dialog-detail.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DialogHistoricComponent } from './components/dialogs/historics/dialog-historic/dialog-historic.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DialogEditComponent } from './components/dialogs/equipments/dialog-edit/dialog-edit.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ProgressComponent } from './components/upload-file/progress/progress.component';
import { PreviewComponent } from './components/upload-file/preview/preview.component';
import { CreateEquipmentComponent } from './pages/create/create-equipment.component';

import { EquipmentService } from './services/equipment.service';
import { ManagerService } from '../shared/services/manager.service';
import { LocationService } from './services/location.service';
import { EquipmentStateService } from './services/equipment-state.service';
import { EquipmentValorationService } from './services/equipment-valoration.service';
import { BranchOfficeService } from './services/branch-office.service';
import { EquipmentHistoricService } from './services/equipment-historic.service';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { BrandService } from './services/brand.service';
import { ModelService } from './services/model.service';

import { DateAgoPipe } from './pipes/date-ago.pipe';
import { AccentPipe } from './pipes/accent.pipe';

import { DragAndDropDirective } from './directives/drag-and-drop.directive';

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
    CreateEquipmentComponent,
    UploadFileComponent,
    ProgressComponent,
    DragAndDropDirective,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    EquipmentService,
    LocationService,
    EquipmentStateService,
    EquipmentValorationService,
    BranchOfficeService,
    EquipmentHistoricService,
    UserService,
    DataService,
    BrandService,
    ModelService,
    EquipmentNameService
  ],
  bootstrap: []
})
export class MainModule { }
