import { EquipmentData } from './../../models/detailData.model';
import { DetailData } from '../../models/detailData.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  private detailData$ = new BehaviorSubject<DetailData>(null);
  private equipmentData$ = new BehaviorSubject<EquipmentData>(null);

  constructor() { }

  public setDetailData(value: DetailData): void {
    this.detailData$.next(value);
  }

  public getDetailData(): Observable<DetailData> {
    return this.detailData$.asObservable();
  }

  public setEquipments(value: EquipmentData): void {
    this.equipmentData$.next(value);
  }

  public getEquipments(): Observable<EquipmentData> {
    return this.equipmentData$.asObservable();
  }
}
