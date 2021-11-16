import { EquipmentFault } from './../models/equipments/equipment-fault.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentFaultService {

  private url: string;
  private partialUrl: string;

  private create$ = new Subject<void>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public create(equipmentFault: EquipmentFault): Observable<boolean>{
    this.partialUrl = `${this.url}/api/EquipmentFault`;
    return this.http.post<boolean>(this.partialUrl, equipmentFault);
  }

  public saveCreate(): void {
    this.create$.next();
  }

  public saveCreateListener(): Observable<void> {
    return this.create$.asObservable();
  }
}
