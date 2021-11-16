import { Injectable } from '@angular/core';

import { ManagerService } from '../../shared/services/manager.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

import { EquipmentType } from '../models/equipments/equipment-type';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(districtId?: number): Observable<EquipmentType[]>{
      return this.http.get<EquipmentType[]>(`${this.url}/api/v1/Name`);
  }

  public GetAsync(districtId?: number): Promise<EquipmentType[]>{
    return new Promise((res, rej) => {
      this.http.get<EquipmentType[]>(`${this.url}/api/v1/Name`);
    });
  }
}
