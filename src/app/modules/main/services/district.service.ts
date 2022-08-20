import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { District } from '../models/equipments/district';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(): Observable<District[]>{
    this.partialUrl = `${this.url}/api/District`;
    return this.http.get<District[]>(this.partialUrl);
  }
}
