import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipmentValoration } from '../models/equipments/equipment-valoration';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentValorationService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(): Observable<EquipmentValoration[]>{
    this.partialUrl = `${this.url}/api/Valoration`;
    return this.http.get<EquipmentValoration[]>(this.partialUrl);
  }
}
