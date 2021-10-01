import { DetailData } from './../../../../../models/detailData.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-current',
  templateUrl: './detail-current.component.html',
  styleUrls: ['./detail-current.component.css']
})
export class DetailCurrentComponent implements OnInit {

  private _detailData: DetailData;

  @Input()
  set detailData(value: DetailData) {
    if (value) {
      this._detailData = value;
    }
  }

  get detailData(): DetailData {
    return this._detailData;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
