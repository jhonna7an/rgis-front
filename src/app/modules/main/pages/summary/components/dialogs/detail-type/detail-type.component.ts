import { Component, OnInit } from '@angular/core';
import { DialogBaseComponent } from '../../../models/dialog-base-component.model';

@Component({
  selector: 'app-detail-type',
  templateUrl: './detail-type.component.html',
  styleUrls: ['./detail-type.component.css']
})
export class DetailTypeComponent implements OnInit, DialogBaseComponent {

  constructor() { }

  ngOnInit(): void {
  }

}
