import { EventEmitter, Injectable } from '@angular/core';

import { ManagerService } from './manager.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

import { Equipment, EquipmentAbm } from '../models/equipments/equipment';
import { FilterData } from '../models/pages/equipment-detail';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private url: string;
  private partialUrl: string;

  public edited$ = new EventEmitter<boolean>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(districtId?: number): Observable<Equipment[]>{
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    if (districtId != undefined || districtId != null) {
      this.partialUrl += `?districtId=${districtId}`;
    }

    return this.http.get<Equipment[]>(this.partialUrl);
  }

  public editEquipment = (equipment: EquipmentAbm): Observable<boolean> => {
    this.partialUrl = `${this.url}/api/v1/Equipment`;
    return this.http.put<boolean>(this.partialUrl, equipment);
  }
}
