import { Injectable } from '@angular/core';
import { ManagerService } from './manager.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EquipmentLocation } from '../models/equipments/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(): Observable<EquipmentLocation[]> {
    this.partialUrl = `${this.url}/api/Location`;
    return this.http.get<EquipmentLocation[]>(this.partialUrl);
  }
}
