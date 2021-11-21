import { EquipmentFault } from './../models/equipments/equipment-fault.model';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentFaultService {

  private url: string;
  private partialUrl: string;

  private isDisabled$ = new BehaviorSubject<boolean>(false);
  private createSubmitEvent$ = new Subject<void>();
  private createEndEvent$ = new Subject<boolean>();
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public create(equipmentFault: EquipmentFault): Observable<boolean>{
    this.partialUrl = `${this.url}/api/EquipmentFault`;
    return this.http.post<boolean>(this.partialUrl, equipmentFault);
  }

  public setIsDisabled(value: boolean): void {
    this.isDisabled$.next(value);
  }

  public getIsDisabled(): Observable<boolean> {
    return this.isDisabled$.asObservable();
  }

  public setSaveCreateEvent(): void {
    this.createSubmitEvent$.next();
  }

  public getSaveCreateEvent(): Observable<void> {
    return this.createSubmitEvent$.asObservable();
  }

  public setCreateEndEvent(value: boolean): void {
    this.createEndEvent$.next(value);
  }

  public getCreateEndEvent(): Observable<boolean> {
    return this.createEndEvent$.asObservable();
  }

  public setIsLoading(value: boolean): void{
    this.isLoading$.next(value);
  }

  public getIsLoading(): Observable<boolean>{
    return this.isLoading$.asObservable();
  }
}
