import { HistoricService } from 'src/app/modules/main/services/historic.service';
import { DetailData, EquipmentData, FilterData, FilterDetail, FilterDetailItem } from 'src/app/modules/main/models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit, Predicate } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Equipment } from '../../../models/equipments/equipment';
import { DetailService } from '../../../services/workflow/detail.service';
import { EquipmentService } from '../../../services/equipment.service';
import { Historic } from '../../../models/equipments/historicEquipment';

@Component({
  selector: 'app-sidebar-detail',
  templateUrl: './sidebar-detail.component.html',
  styleUrls: ['./sidebar-detail.component.css']
})
export class SidebarDetailComponent extends BaseComponent implements OnInit {

  public detailData: DetailData;
  private equipmentData: EquipmentData;
  public serialForm: FormGroup;

  public type: FilterDetail;
  public district: FilterDetail;
  public location: FilterDetail;
  public state: FilterDetail;
  public model: FilterDetail;
  public brand: FilterDetail;

  public hasTypeFilter: boolean;
  public isSidebarHide: boolean;

  public filterApply: string;
  public serialFilter: string;

  constructor(
    public detailService: DetailService,
    private equipmentService: EquipmentService,
    private historicService: HistoricService,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef
  ) {
    super();
    this.hasTypeFilter = false;
  }

  ngOnInit(): void {
    this.createSerialForm();

    // Subscribe to DETAIL DATA
    this.detailService.getDetailData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DetailData) => {
        if (response) {
          this.detailData = response;

          if (!response.historicData.hasHistoricSearch) {
            this.isSidebarHide = response.isMainHistoricTab;
          }
        }
      });

    // Subscribe to EQUIPMENTS SUBJECT
    this.detailService.getEquipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentData) => {
        if (response) {
          this.equipmentData = response;
          this.isSidebarHide = false;
          this.setFilters();

          if (!response.isSidebarEvent) {
            this.detailService.setLoading(false);
          }
        }
      });
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  public restartFilters(): void{
    if (!this.detailData.isMainHistoricTab) {
      this.restartCurrentFilters();
    } else {
      this.restartHistoricFilters();
    }
  }

  private restartCurrentFilters(): void {
    this.detailService.setLoading(true);
    this.equipmentService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        if (response) {
          this.equipmentData.setEventFromSidebar(response, this.detailData.isMainHistoricTab);
          this.detailService.setEquipments(this.equipmentData);
          this.hasTypeFilter = false;
        }
      });
  }

  private restartHistoricFilters(): void{
    this.detailService.setLoading(true);
    this.historicService.getByDate(
      1,
      this.detailData.historicData.search,
      this.detailData.historicData.from,
      this.detailData.historicData.to)
      .pipe(takeUntil(this.destroy$))
      .subscribe(((response: Historic[]) => {
        if (response) {
          this.equipmentData.setEventFromSidebar(response, this.detailData.isMainHistoricTab);
          this.detailService.setEquipments(this.equipmentData);
          this.hasTypeFilter = false;
        }
      }));
  }

  public searchByFilter(filter: FilterData): void {
    this.detailService.setLoading(true);

    setTimeout(() => {
      const predicate = this.getFilterPredicate(filter);
      const equipmentsFiltered = this.equipmentData.equipments.filter(predicate);
      this.equipmentData.setEventFromSidebar(equipmentsFiltered, this.detailData.isMainHistoricTab);

      if (filter.group === 'Equipo'){
        this.hasTypeFilter = true;
        this.model = this.SetFilterDetail('Modelo');
        this.brand = this.SetFilterDetail('Marca');
      }

      this.filterApply = filter.value;
      this.detailService.setEquipments(this.equipmentData);
    }, 250);
  }

  public searchBySerial(value: any): void {
    this.detailService.setLoading(true);

    setTimeout(() => {
      const equipmentsFilterBySerial = this.equipmentData.equipments.filter(x => x.serial === value.serial);
      this.equipmentData.setEventFromSidebar(equipmentsFilterBySerial, this.detailData.isMainHistoricTab);
      this.detailService.setEquipments(this.equipmentData);
    }, 250);
  }

  private setFilters(): void{
    this.type = this.SetFilterDetail('Equipo');
    this.district = this.SetFilterDetail('Distrito');
    this.location = this.SetFilterDetail('Ubicación');
    this.state = this.SetFilterDetail('Estado');
    this.model = this.SetFilterDetail('Modelo');
    this.brand = this.SetFilterDetail('Marca');
  }

  private createSerialForm(): void{
    this.serialForm = this.formBuilder.group({
      serial: ['', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(10)
      ])]
    });
  }

  private SetFilterDetail(title: string): FilterDetail{
    if (this.equipmentData.equipments){
      const filterGrouping = this.equipmentData.equipments.reduce((result: any, equipment: Equipment) => ({
        ...result, [this.getFilterParam(title, equipment)]: [ ...(result[this.getFilterParam(title, equipment)] || []), equipment ],
      }), {});

      const groupLength = Object.getOwnPropertyNames(filterGrouping).length;
      const sidebarFilter = new Array<FilterDetailItem>();

      for (const item in filterGrouping) {
        const models: Equipment[] = filterGrouping[item];
        sidebarFilter.push(new FilterDetailItem(item, models.length));
      }
      return new FilterDetail(title, sidebarFilter, groupLength);
    }
  }

  private getFilterParam(filter: string, equipment: Equipment): string{
    switch (filter) {
      case 'Equipo':
        return equipment.type;
      case 'Distrito':
        return equipment.district;
      case 'Ubicación':
        return equipment.location;
      case 'Estado':
        return equipment.state;
      case 'Modelo':
        return equipment.model;
      case 'Marca':
        return equipment.brand;
    }
  }

  private getFilterPredicate = (filter: FilterData): Predicate<Equipment> => {
    switch (filter.group) {
      case 'Equipo':
        return (x: Equipment) => x.type === filter.value;
      case 'Distrito':
        return (x: Equipment) => x.district === filter.value;
      case 'Ubicación':
        return (x: Equipment) => x.location === filter.value;
      case 'Estado':
        return (x: Equipment) => x.state === filter.value;
      case 'Modelo':
        return (x: Equipment) => x.model === filter.value;
      case 'Marca':
        return (x: Equipment) => x.brand === filter.value;
      default:
        break;
    }
  }
}
