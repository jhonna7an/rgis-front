import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { HistoricEquipment, Historic } from '../models/equipments/historicEquipment';
import { Equipment } from '../models/equipments/equipment';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getById = (id: number): Observable<HistoricEquipment> => {
    this.partialUrl = `${this.url}/api/v1/Historic/${id}`;

    return this.http.get<HistoricEquipment>(this.partialUrl);
  }

  public GetByEquipmentId(equipmentId?: number): Observable<HistoricEquipment[]>{
    this.partialUrl = `${this.url}/api/v1/Historic/GetByEquipmentId?equipmentId=${equipmentId}`;

    return this.http.get<HistoricEquipment[]>(this.partialUrl);
  }

  //nueva version
  public GetByEquipmentId2(equipmentId?: number, search?: string, from?: string, to?: string): Observable<Historic[]>{
    this.partialUrl = `${this.url}/api/v1/Historic/GetByEquipmentId?equipmentId=${equipmentId}`;

    if (search) {
      this.partialUrl += `&search=${search}`;
    }

    if (from && to) {
      this.partialUrl += `&from=${from}&to=${to}`;
    }

    return this.http.get<Historic[]>(this.partialUrl);
  }


  public getByDate = (countryId: number, search?:string, from?:string, to?:string): Observable<Historic[]> => {
    this.partialUrl = `${this.url}/api/v1/Historic/GetEquipmentsByDate?countryId=${countryId}`;

    if (search) {
      this.partialUrl += `&search=${search}`;
    }

    if (from && to) {
      this.partialUrl += `&from=${from}&to=${to}`;
    }

    if (!from && !to && !search){
      search = new DatePipe('en-US').transform(new Date(), 'MM/dd/yyyy');
      this.partialUrl += `&search=${search}`;
    }

    return this.http.get<Historic[]>(this.partialUrl)
              .pipe(map((response: Historic[]) => {
                return response;
              }));
  }

  public getHistoricsByDate = (equipmentId: number, search?: string, from?: string, to?: string): Observable<HistoricEquipment[]> => {
    this.partialUrl = `${this.url}/api/v1/Historic/GetHistoricsByDate?equipmentId=${equipmentId}`;

    if (from && to) {
      this.partialUrl += `&from=${from}&to=${to}`;
    }

    if (search) {
      this.partialUrl += `&search=${search}`;
    }

    return this.http.get<HistoricEquipment[]>(this.partialUrl);
  }

  public getHistoricsMatched = (countryId: number, search?: string, from?: string, to?: string): Observable<Historic[]> => {
    this.partialUrl = `${this.url}/api/v1/Historic/HistoricsMatch?countryId=${countryId}`;

    if (from && to) {
      this.partialUrl += `&from=${from}&to=${to}`;
    }

    if (search) {
      this.partialUrl += `&search=${search}`;
    }

    return this.http.get<Historic[]>(this.partialUrl);
  }
}


