import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { District } from 'src/app/models/district.model';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { DistrictService } from 'src/app/modules/shared/services/district.service';
import { CountryService } from '../../../../../shared/services/country.service';

import { Country } from '../../../../../shared/models/management/country.model';
import { UserToken } from 'src/app/modules/auth/pages/login/models/user-token.model';

import { SummarySubject } from '../../subjects/summary.subject';
import { SidebarDetail } from '../../models/sidebar-detail';
import { SummaryDetail } from '../../models/summary-detail.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends BaseComponent implements OnInit {

  public country: Country;

  public locations: SidebarDetail[];
  public states: SidebarDetail[];

  public xpandStatus: boolean = true;
  public showDetail: boolean = false;

  public districts: District[];
  public loading$: Observable<boolean>;

  constructor(
    private equipmentService: EquipmentService,
    private districtService: DistrictService,
    private countryService: CountryService,
    private summarySubject: SummarySubject
  ) {
    super();
  }

  ngOnInit(): void {
    this.locations = new Array<SidebarDetail>();
    this.states = new Array<SidebarDetail>();

    this.loading$ = this.summarySubject.getLoading();

    const user: UserToken = JSON.parse(localStorage.getItem("user"));

    if (user) {
      this.getCountry(user.countryId);
      this.getDisctricts(user.countryId);
    }
  }

  public getByCountry(): void {
    this.showDetail = true;
    this.summarySubject.setLoading(true);

    this.equipmentService
      .getByCountry(this.country.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        if (response) {
          const summary_detail = new SummaryDetail(response);
          summary_detail.setByCountry();
          this.summarySubject.setEquipments(summary_detail);
          this.setDetail(response);
          this.summarySubject.setNameDetail(this.country.name);
        }
      }, error => console.log(error))
      .add(() => {
        this.summarySubject.setLoading(false);
      });
  }

  public getByDistrict(district: District) : void {
    this.showDetail = true;
    this.summarySubject.setLoading(true);

    this.equipmentService
      .getByDistrict(district.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        if (response) {
          const summary_detail = new SummaryDetail(response);
          summary_detail.setByDistrict();
          this.summarySubject.setDistrict(district);
          this.summarySubject.setEquipments(summary_detail);
          this.setDetail(response);
          this.summarySubject.setNameDetail(district.districtName);
        }
      }, error => console.log(error))
      .add(() => {
        this.summarySubject.setLoading(false);
      });
  }

  private setDetail(equipments: Equipment[]) : void {
    this.locations.splice(0, this.locations.length);
    this.states.splice(0, this.states.length);

    const locationGrouping = equipments.reduce((result: any, equipment: Equipment) => ({
        ...result, [equipment.location]: [ ...(result[equipment.location] || []), equipment ],
      }), {});

    const stateGrouping = equipments.reduce((result: any, equipment: Equipment) => ({
      ...result, [equipment.state]: [ ...(result[equipment.state] || []), equipment ],
    }), {});

    for (const key in locationGrouping) {
      this.locations.push(new SidebarDetail(key, locationGrouping[key].length));
    }

    for (const key in stateGrouping) {
      this.states.push(new SidebarDetail(key, stateGrouping[key].length));
    }
  }

  private getDisctricts(countryId: number){
    this.districtService
      .getDistrictsByCountry(countryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: District[]) => {
        this.districts = response;
      });
  }

  private getCountry(id: number): void {
    this.countryService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Country) => {
        this.country = response;
      });
  }
}
