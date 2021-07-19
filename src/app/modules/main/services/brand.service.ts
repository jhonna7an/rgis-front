import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipmentBrand } from '../models/equipments/equipment-brand';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(nameId: number): Observable<EquipmentBrand[]>{
    this.partialUrl = `${this.url}/api/Brand?nameId=${nameId}`;
    return this.http.get<EquipmentBrand[]>(this.partialUrl);
  }
}
