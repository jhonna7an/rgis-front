import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentAssignment } from '../models/equipments/equipment-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentAssignmentService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getAssignments(equipmentId: number): Observable<EquipmentAssignment[]>{
    this.partialUrl = `${this.url}/api/EquipmentAssignment?equipmentId=${equipmentId}`;
    return this.http.get<EquipmentAssignment[]>(this.partialUrl);
  }

  public getByEquipmentId(equipmentId: number): Observable<EquipmentAssignment>{
    this.partialUrl = `${this.url}/api/EquipmentAssignment/GetByEquipmentId?equipmentId=${equipmentId}`;
    return this.http.get<EquipmentAssignment>(this.partialUrl);
  }
}
