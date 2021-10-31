import { DetailData, MultiEditData } from './../models/detailData.model';
import { EventEmitter, Injectable } from '@angular/core';

import { ManagerService } from '../../shared/services/manager.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { EquipmentAbm, Equipment } from '../models/equipments/equipment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private url: string;
  private partialUrl: string;

  // private detailData$ = new Subject<DetailData>();
  private equipments$ = new Subject<Equipment[]>();
  private restartEquipments$ = new Subject<void>();

  private edit$ = new Subject<boolean>();
  private equipmentToEdit$ = new Subject<EquipmentAbm>();
  private multiEditData$ = new Subject<MultiEditData>();
  private faultCreate$ = new Subject<EquipmentAbm>();


  // public edited$ = new EventEmitter<boolean>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(districtId?: number): Observable<Equipment[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    if (districtId) {
      this.partialUrl += `?districtId=${districtId}`;
    }

    return this.http.get<Equipment[]>(this.partialUrl);
  }

  public edit(equipment: EquipmentAbm): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    return this.http.put<boolean>(this.partialUrl, equipment);
  }

  public create(equipment: EquipmentAbm): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    return this.http.post<boolean>(this.partialUrl, equipment);
  }

  public createList(equipments: Array<EquipmentAbm>): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Equipment/createList`;
    return this.http.post<boolean>(this.partialUrl, equipments);
  }

  public setEquipments(equipments: Equipment[]): void {
    this.equipments$.next(equipments);
  }

  public getEquipmentsSubject(): Observable<Equipment[]> {
    return this.equipments$.asObservable();
  }

  public setMultiEditData(value: MultiEditData): void {
    this.multiEditData$.next(value);
  }

  public getMultiEditData(): Observable<MultiEditData> {
    return this.multiEditData$.asObservable();
  }
  // public setEquipmentDetail(value: DetailData): void {
  //   this.detailData$.next(value);
  // }

  // public getEquipmentDetail(): Observable<DetailData> {
  //   return this.detailData$.asObservable();
  // }

  public saveEdit(): void {
    this.edit$.next(true);
  }

  public saveEditListener(): Observable<boolean> {
    return this.edit$.asObservable();
  }

  public setEquipmentToEdit(value: EquipmentAbm): void {
    this.equipmentToEdit$.next(value);
  }

  public getEquipmentToEdit(): Observable<EquipmentAbm> {
    return this.equipmentToEdit$.asObservable();
  }

  public triggerRestartEquipments(): void {
    this.restartEquipments$.next();
  }

  public restartEquipmentsEvent(): Observable<void> {
    return this.restartEquipments$.asObservable();
  }

  public setFaultCreate(value: EquipmentAbm): void {
    this.faultCreate$.next(value);
  }

  public getFaultCreate(): Observable<EquipmentAbm> {
    return this.faultCreate$.asObservable();
  }
}
