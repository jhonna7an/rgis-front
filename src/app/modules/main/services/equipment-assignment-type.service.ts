import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentAssignmentType } from '../models/equipments/equipment-assignment-type.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentAssignmentTypeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getTypes(): Observable<EquipmentAssignmentType[]>{
    this.partialUrl = `${this.url}/api/EquipmentAssignmentType`;
    return this.http.get<EquipmentAssignmentType[]>(this.partialUrl);
  }
}
