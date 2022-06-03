import { District } from '../../../../../models/district.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Country } from 'src/app/modules/shared/models/management/country.model';
import { SummaryDetail } from '../models/summary-detail.model';

@Injectable()
export class SummarySubject {

  public loading$ = new BehaviorSubject<boolean>(false);
  public district$ = new Subject<District>();
  public country$ = new Subject<Country>();
  public summary_detail$ = new Subject<SummaryDetail>();
  public name_detail$ = new Subject<string>();

  public setLoading(value: boolean): void {
    this.loading$.next(value);
  }

  public getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  public setDistrict(value: District): void {
    this.district$.next(value);
  }

  public getDistrict(): Observable<District> {
    return this.district$.asObservable();
  }

  public setCountry(value: Country): void {
    this.country$.next(value);
  }

  public getCountry(): Observable<Country> {
    return this.country$.asObservable();
  }

  public setEquipments(value: SummaryDetail): void {
    this.summary_detail$.next(value);
  }

  public getEquipments(): Observable<SummaryDetail> {
    return this.summary_detail$.asObservable();
  }

  public setNameDetail(value: string): void {
    this.name_detail$.next(value);
  }

  public getNameDetail(): Observable<string> {
    return this.name_detail$.asObservable();
  }
}
