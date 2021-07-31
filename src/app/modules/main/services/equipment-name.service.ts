import { Observable } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { EquipmentName } from '../models/equipments/equipment-name';

@Injectable({
  providedIn: 'root'
})
export class EquipmentNameService {

  private url: string;
  private partialUrl: string;

  public edited$ = new EventEmitter<boolean>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(): Observable<EquipmentName[]> {
    this.partialUrl = `${this.url}/api/v1/Name`;
    return this.http.get<EquipmentName[]>(this.partialUrl);
  }
}
