import { EquipmentComment } from '../models/equipments/equipment-comment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private url: string;
  private partialUrl: string;

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(equipmentId: number): Observable<EquipmentComment[]>{
    this.partialUrl = `${this.url}/api/v1/Comment?equipmentId=${equipmentId}`;
    return this.http.get<EquipmentComment[]>(this.partialUrl);
  }

  public create(comment): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment`;
    return this.http.post<boolean>(this.partialUrl, comment);
  }

  public edit(comment): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment`;
    return this.http.put<boolean>(this.partialUrl, comment);
  }

  public delete(equipmentId: number): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment/${equipmentId}`;
    return this.http.delete<boolean>(this.partialUrl);
  }
}
