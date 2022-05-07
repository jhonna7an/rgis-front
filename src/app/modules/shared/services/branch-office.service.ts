import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BranchOffice } from 'src/app/models/branch-office.model';
import { environment } from 'src/environments/environment';
import { ManagerService } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public getBranchOffices(districtId: number): Observable<BranchOffice[]>{
    this.partialUrl = `${this.url}/api/branchOffice?districtId=${districtId}`;
    return this.http.get<BranchOffice[]>(this.partialUrl);
  }
}
