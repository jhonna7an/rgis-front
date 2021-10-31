import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { Client } from '../models/equipments/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getAll(): Observable<Client[]>{
    this.partialUrl = `${this.url}/api/Client`;
    return this.http.get<Client[]>(this.partialUrl);
  }
}
