import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UploadFileComponent } from './../upload-file.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: UploadFileComponent) { }

  ngOnInit(): void {
  }

}
