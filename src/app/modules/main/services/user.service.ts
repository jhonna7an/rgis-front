import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserView } from '../models/manager/userView';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(userId: number): Observable<UserView>{
    this.partialUrl = `${this.url}/api/User/${userId}`;
    return this.http.get<UserView>(this.partialUrl);
  }
}
