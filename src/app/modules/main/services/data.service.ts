import { EventEmitter, Injectable } from '@angular/core';
import { EquipmentOther } from 'src/app/modules/main/models/equipments/equipment';
import { FilterSend, MultiEditData } from '../models/detailData.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public equipment$: EventEmitter<EquipmentOther[]>;
  public restart$: EventEmitter<boolean>;
  public filter$: EventEmitter<FilterSend>;
  // public hitorics$: EventEmitter<HistoricDataSend>;
  public multiEditEquipments$: EventEmitter<MultiEditData>;

  constructor() {
    this.equipment$ = new EventEmitter<EquipmentOther[]>();
    this.restart$ = new EventEmitter<boolean>();
    this.filter$ = new EventEmitter<FilterSend>();
    // this.hitorics$ = new EventEmitter<HistoricDataSend>();
    this.multiEditEquipments$ = new EventEmitter<MultiEditData>();
  }
}
