import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './pages/create/create.component';

import { CreateRoutingModule } from './create.routing';
import { MaterialModule } from '../../material.module';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ProgressComponent } from './components/progress/progress.component';
import { PreviewComponent } from './components/preview/preview.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateComponent, UploadFileComponent, ProgressComponent, PreviewComponent],
  imports: [
    CommonModule,
    CreateRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CreateModule { }
