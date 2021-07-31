import { Injectable } from '@angular/core';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentState } from '../models/equipments/equipment-state';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentStateService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(): Observable<EquipmentState[]>{
    this.partialUrl = `${this.url}/api/State`;
    return this.http.get<EquipmentState[]>(this.partialUrl);
  }
}
