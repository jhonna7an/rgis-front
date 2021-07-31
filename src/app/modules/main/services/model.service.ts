import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipmentModel } from '../models/equipments/equipment-model';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(brandId: number, typeId: number): Observable<EquipmentModel[]>{
    this.partialUrl = `${this.url}/api/Model?brandId=${brandId}&nameId=${typeId}`;
    return this.http.get<EquipmentModel[]>(this.partialUrl);
  }
}
