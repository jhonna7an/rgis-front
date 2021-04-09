import { EventEmitter, Injectable } from '@angular/core';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { FilterSend, HistoricDataSend, MultiEditData } from '../models/pages/equipment-detail';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public equipment$: EventEmitter<Equipment[]>;
  public restart$: EventEmitter<boolean>;
  public filter$: EventEmitter<FilterSend>;
  public hitorics$: EventEmitter<HistoricDataSend>;
  public multiEditEquipments$: EventEmitter<MultiEditData>;

  constructor() {
    this.equipment$ = new EventEmitter<Equipment[]>();
    this.restart$ = new EventEmitter<boolean>();
    this.filter$ = new EventEmitter<FilterSend>();
    this.hitorics$ = new EventEmitter<HistoricDataSend>();
    this.multiEditEquipments$ = new EventEmitter<MultiEditData>();
  }
}
