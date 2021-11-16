import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { Employee } from '../models/Manager/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(): Observable<Employee[]>{
    this.partialUrl = `${this.url}/api/Employee`;
    return this.http.get<Employee[]>(this.partialUrl);
  }
}
