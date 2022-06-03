import { EquipmentFaultService } from './services/equipment-fault.service';
import { EmployeeService } from './services/employee.service';
import { FaultDetailService } from './services/fault-detail.service';
import { ClientService } from './services/client.service';
import { DetailService } from './services/workflow/detail.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentRoutingModule } from './equipment.routing';

import { DetailCurrentComponent } from './components/dialogs/equipments/dialog-detail/detail-current/detail-current.component';
import { SidebarDetailItemComponent } from './components/sidebar/sidebar-detail/sidebar-detail-item/sidebar-detail-item.component';
import { SidebarDetailComponent } from './components/sidebar/sidebar-detail/sidebar-detail.component';
import { DatatableComponent } from './components/body/detail/datatable/datatable.component';
import { CurrentDetailComponent } from './components/body/detail/current-detail/current-detail.component';
import { HistoricDetailComponent } from './components/body/detail/historic-detail/historic-detail.component';
import { DetailComponent } from './components/body/detail/detail.component';
import { EquipmentDetailComponent } from './pages/detail/equipment-detail.component';
import { SidebarComponent } from './components/sidebar/sidebar/sidebar.component';
import { DialogDetailComponent } from './components/dialogs/equipments/dialog-detail/dialog-detail.component';
import { DialogHistoricComponent } from './components/dialogs/historics/dialog-historic/dialog-historic.component';
import { DialogEditComponent } from './components/dialogs/equipments/dialog-edit/dialog-edit.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ProgressComponent } from './components/upload-file/progress/progress.component';
import { PreviewComponent } from './components/upload-file/preview/preview.component';
import { CreateEquipmentComponent } from './pages/create/create-equipment.component';
import { CommentComponent } from './components/dialogs/equipments/dialog-detail/comments/comments.component';
import { DetailHistoricComponent } from './components/dialogs/equipments/dialog-detail/detail-historic/detail-historic.component';
import { DeleteConfirmComponent } from './components/dialogs/equipments/dialog-detail/comments/delete-confirm/delete-confirm.component';
import { DetailItemComponent } from './components/dialogs/equipments/dialog-detail/detail-item/detail-item.component';
import { EditItemComponent } from './components/dialogs/equipments/dialog-detail/edit-item/edit-item.component';

import { EquipmentTypeService } from './services/equipment-name.service';
import { CommentService } from './services/comment.service';
import { EquipmentService } from './services/equipment.service';
import { LocationService } from './services/location.service';
import { EquipmentStateService } from './services/equipment-state.service';
import { EquipmentValorationService } from './services/equipment-valoration.service';
import { BranchOfficeService } from './services/branch-office.service';
import { HistoricService } from './services/historic.service';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { BrandService } from './services/brand.service';
import { ModelService } from './services/model.service';

import { DateAgoPipe } from './pipes/date-ago.pipe';
import { AccentPipe } from './pipes/accent.pipe';

import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { SidebarHeaderComponent } from './components/sidebar/sidebar-detail/sidebar-header/sidebar-header.component';
import { FaultCreateComponent } from './components/dialogs/equipments/dialog-detail/fault-create/fault-create.component';
import { DialogMultiChoiceComponent } from './components/dialogs/equipments/dialog-multi-choice/dialog-multi-choice.component';
import { CreateAssignmentComponent } from './components/dialogs/equipments/create-asignation/create-assignment.component';
import { DetailAssignmentComponent } from './components/dialogs/equipments/dialog-detail/detail-assignment/detail-assignment.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

export { DistrictService } from './services/district.service';
@NgModule({
  declarations: [
    EquipmentDetailComponent,
    SidebarDetailItemComponent,
    SidebarComponent,
    SidebarDetailComponent,
    DetailComponent,
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
    PreviewComponent,
    CurrentDetailComponent,
    HistoricDetailComponent,
    DetailCurrentComponent,
    CommentComponent,
    DetailHistoricComponent,
    DeleteConfirmComponent,
    DetailItemComponent,
    EditItemComponent,
    SidebarHeaderComponent,
    FaultCreateComponent,
    DialogMultiChoiceComponent,
    CreateAssignmentComponent,
    DetailAssignmentComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    EquipmentRoutingModule
  ],
  providers: [
    EquipmentService,
    LocationService,
    EquipmentStateService,
    EquipmentValorationService,
    BranchOfficeService,
    HistoricService,
    UserService,
    DataService,
    BrandService,
    ModelService,
    EquipmentTypeService,
    CommentService,
    DetailService,
    ClientService,
    FaultDetailService,
    EmployeeService,
    EquipmentFaultService
  ],
  bootstrap: []
})
export class EquipmentModule { }
