import { Component, Input, OnInit } from '@angular/core';
import { EquipmentRead } from '../../../../../models/equipments/equipment';

@Component({
  selector: 'app-detail-current',
  templateUrl: './detail-current.component.html',
  styleUrls: ['./detail-current.component.css']
})
export class DetailCurrentComponent implements OnInit {

  public _equipment: EquipmentRead;

  @Input()
  set equipment(value: EquipmentRead){
    if (value) {
      console.log(value);
      this._equipment = value;
    }
  }

  get equipment(): EquipmentRead {
    return this._equipment;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
