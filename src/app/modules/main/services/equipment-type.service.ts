import { Injectable } from '@angular/core';

import { ManagerService } from '../../shared/services/manager.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

import { EquipmentName } from '../models/equipments/equipment-name';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(districtId?: number): Observable<EquipmentName[]>{
      return this.http.get<EquipmentName[]>(`${this.url}/api/v1/Name`);
  }

  public GetAsync(districtId?: number): Promise<EquipmentName[]>{
    return new Promise((res, rej) => {
      this.http.get<EquipmentName[]>(`${this.url}/api/v1/Name`);
    });
  }
}
