import { DetailData, EditOneData, MultiEditData } from './../models/detailData.model';
import { EventEmitter, Injectable } from '@angular/core';

import { ManagerService } from '../../shared/services/manager.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { EquipmentAbm, Equipment } from '../models/equipments/equipment';
import { EquipmentCreate } from '../pages/create/models/equipment-create.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private url: string;
  private partialUrl: string;

  private equipments$ = new Subject<Equipment[]>();
  private restartEquipments$ = new Subject<void>();

  private edit$ = new Subject<EditOneData>();
  private isBtnSubmitDisable$ = new BehaviorSubject<boolean>(false);
  private equipmentToEdit$ = new Subject<EquipmentAbm>();
  private editEndEvent = new Subject<boolean>();
  private multiEditData$ = new Subject<MultiEditData>();
  private faultCreate$ = new Subject<EquipmentAbm>();
  private multiChoice$ = new Subject<Equipment>();
  private multiChoiceEquipments$ = new Subject<Equipment[]>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(): Observable<Equipment[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    return this.http.get<Equipment[]>(this.partialUrl);
  }

  public getByDistrict(districtId: number): Observable<Equipment[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment?districtId=${districtId}`;
    return this.http.get<Equipment[]>(this.partialUrl);
  }

  public getByCountry(countryId: number): Observable<Equipment[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment?countryId=${countryId}`;
    return this.http.get<Equipment[]>(this.partialUrl);
  }

  public edit(equipment: EquipmentAbm): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    return this.http.put<boolean>(this.partialUrl, equipment);
  }

  public create(equipment: EquipmentCreate): Observable<boolean> {
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

  public setEditSaveEvent(value: EditOneData): void {
    this.edit$.next(value);
  }

  public getEditSaveEvent(): Observable<EditOneData> {
    return this.edit$.asObservable();
  }

  public setEditEndEvent(value: boolean): void {
    this.editEndEvent.next(value);
  }

  public getEditEndEvent(): Observable<boolean> {
    return this.editEndEvent.asObservable();
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

  public setIsSubmitBtnDisable(value: boolean): void{
    this.isBtnSubmitDisable$.next(value);
  }


  public getIsSubmitBtnDisable(): Observable<boolean>{
    return this.isBtnSubmitDisable$.asObservable();
  }

  public setMultiChoiceEquipment(value: Equipment): void{
    this.multiChoice$.next(value);
  }

  public getMultiChoiceEquipment(): Observable<Equipment>{
    return this.multiChoice$.asObservable();
  }

  public setMultiChoiceEquipments(value: Equipment[]): void{
    this.multiChoiceEquipments$.next(value);
  }

  public getMultiChoiceEquipments(): Observable<Equipment[]>{
    return this.multiChoiceEquipments$.asObservable();
  }
}
