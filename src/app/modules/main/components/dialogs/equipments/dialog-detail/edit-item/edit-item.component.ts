import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { BaseComponent } from '../../../../../../core/components/base/base.component';
import { DetailData } from './../../../../../models/detailData.model';
import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent extends BaseComponent implements OnInit {

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

  constructor(
    private equipmentService: EquipmentService
  ) {
    super();
  }

  ngOnInit(): void {
  }
}
