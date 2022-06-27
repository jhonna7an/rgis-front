import { SidenavService } from './services/sidenav.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared.routing';

import { FooterComponent } from './components/footer/footer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from './material.module';
import { ToastComponent } from './components/toast/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AnimationComponent } from './components/animation/animation.component';
import { ManagerService } from './services/manager.service';
import { SpinnerService } from './services/spinner.service';
import{ DistrictService } from './services/district.service';
import { BranchOfficeService } from './services/branch-office.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    FooterComponent,
    ToolbarComponent,
    LoadingComponent,
    DialogComponent,
    ToastComponent,
    SpinnerComponent,
    AnimationComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedRoutingModule
  ],
  exports: [
    SpinnerComponent,
    LoadingComponent,
    ToolbarComponent,
    FooterComponent
  ],
  providers: [
    ManagerService,
    SpinnerService,
    SidenavService,
    DistrictService,
    BranchOfficeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class SharedModule { }
