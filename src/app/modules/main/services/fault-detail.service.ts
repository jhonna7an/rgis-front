import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentFaultDetail } from '../models/equipments/equipment-fault-detail';

@Injectable({
  providedIn: 'root'
})
export class FaultDetailService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(typeId: number): Observable<EquipmentFaultDetail[]>{
    this.partialUrl = `${this.url}/api/FaultDetail?typeId=${typeId}`;
    return this.http.get<EquipmentFaultDetail[]>(this.partialUrl);
  }
}
