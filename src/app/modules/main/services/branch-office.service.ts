import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';
import { BranchOffice } from '../models/manager/branch-office';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public Get(districtId: number): Observable<BranchOffice[]>{
    this.partialUrl = `${this.url}/api/BranchOffice?districtId=${districtId}`;
    return this.http.get<BranchOffice[]>(this.partialUrl);
  }
}
