import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from 'src/app/models/district.model';
import { environment } from 'src/environments/environment';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getDistricts(): Observable<District[]>{
    this.partialUrl = `${this.url}/api/district`;
    return this.http.get<District[]>(this.partialUrl);
  }

  public getDistrictsByCountry(countryId: number): Observable<District[]>{
    this.partialUrl = `${this.url}/api/district/country/${countryId}`;
    return this.http.get<District[]>(this.partialUrl);
  }
}
