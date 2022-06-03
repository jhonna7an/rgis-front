import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../models/management/country.model';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getById(id: number): Observable<Country>{
    this.partialUrl = `${this.url}/api/country/${id}`;
    return this.http.get<Country>(this.partialUrl);
  }
}
