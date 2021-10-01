import { EquipmentComment } from '../models/equipments/equipment-comment';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManagerService } from '../../shared/services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private url: string;
  private partialUrl: string;

  private commentsById: EquipmentComment[];
  private commentsLoaded$ = new Subject<void>();

  constructor(private http: ManagerService) {
    this.url = `${environment.baseURL}`;
  }

  public get(equipmentId: number): Observable<EquipmentComment[]>{
    this.partialUrl = `${this.url}/api/v1/Comment?equipmentId=${equipmentId}`;
    return this.http.get<EquipmentComment[]>(this.partialUrl);
  }

  public create(comment: EquipmentComment): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment`;
    return this.http.post<boolean>(this.partialUrl, comment);
  }

  public edit(comment: EquipmentComment): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment`;
    return this.http.put<boolean>(this.partialUrl, comment);
  }

  public delete(id: number): Observable<boolean> {
    this.partialUrl = `${this.url}/api/v1/Comment/${id}`;
    return this.http.delete<boolean>(this.partialUrl);
  }

  public setComments(value: EquipmentComment[]): void {
    this.commentsById = value;
  }

  public getComments(): EquipmentComment[] {
    return this.commentsById;
  }

  public triggerCommentsLoaded(): void {
    this.commentsLoaded$.next();
  }

  public commentsLoadedEvent(): Observable<void> {
    return this.commentsLoaded$.asObservable();
  }
}
