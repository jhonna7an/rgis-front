import { MultiEditData } from 'src/app/modules/main/models/pages/equipment-detail';
import { EventEmitter, Injectable } from '@angular/core';

import { ManagerService } from '../../shared/services/manager.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Equipment, EquipmentAbm, EquipmentRead } from '../models/equipments/equipment';
import { FilterData } from '../models/pages/equipment-detail';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private url: string;
  private partialUrl: string;

  private equipments$ = new Subject<EquipmentRead[]>();
  private multiEditData$ = new Subject<MultiEditData>();
  private isLoading$ = new BehaviorSubject<boolean>(false);
  public edited$ = new EventEmitter<boolean>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(districtId?: number): Observable<EquipmentRead[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    if (districtId) {
      this.partialUrl += `?districtId=${districtId}`;
    }

    return this.http.get<EquipmentRead[]>(this.partialUrl);
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

  public setEquipments(equipments: EquipmentRead[]): void {
    this.equipments$.next(equipments);
  }

  public getEquipmentsSubject(): Observable<EquipmentRead[]> {
    return this.equipments$.asObservable();
  }

  public setLoading(value: boolean): void {
    this.isLoading$.next(value);
  }

  public isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  public setMultiEditData(value: MultiEditData): void {
    this.multiEditData$.next(value);
  }

  public getMultiEditData(): Observable<MultiEditData> {
    return this.multiEditData$.asObservable();
  }
}
