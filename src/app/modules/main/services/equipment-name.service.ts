import { Observable } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentType } from '../models/equipments/equipment-type';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {

  private url: string;
  private partialUrl: string;

  public edited$ = new EventEmitter<boolean>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(): Observable<EquipmentType[]> {
    this.partialUrl = `${this.url}/api/v1/Name`;
    return this.http.get<EquipmentType[]>(this.partialUrl);
  }

  public getByTypeId(typeId: number): Observable<EquipmentType[]> {
    this.partialUrl = `${this.url}/api/v1/Name`;
    return this.http.get<EquipmentType[]>(this.partialUrl);
  }
}
