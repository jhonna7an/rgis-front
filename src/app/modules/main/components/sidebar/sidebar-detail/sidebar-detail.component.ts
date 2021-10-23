import { HistoricService } from 'src/app/modules/main/services/historic.service';
import { DetailData, EquipmentData, FilterData, FilterDetail, FilterDetailItem, FilterSend, HistoricDataSend } from 'src/app/modules/main/models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { ChangeDetectorRef, Component, Input, OnInit, Predicate, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Equipment, EquipmentOther } from '../../../models/equipments/equipment';
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

  public filterList: string[];
  public currentFilterList: string[];
  public historicFilterList: string[]
  public hasFilter: boolean;
  public hasCurrentFilter: boolean;
  public hasHistoricFilter: boolean;
  public hasTypeFilter: boolean;
  public isSidebarHide: boolean;





  private historicsBackup: EquipmentOther[];

  public serialFilter: string;

  constructor(
    public detailService: DetailService,
    private equipmentService: EquipmentService,
    private historicService: HistoricService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private cdref: ChangeDetectorRef
  ) {
    super();
    this.filterList = new Array<string>();
    this.currentFilterList = new Array<string>();
    this.historicFilterList = new Array<string>();

    this.hasFilter = false;
    this.hasTypeFilter = false;
  }

  ngOnInit(): void {
    this.createSerialForm();

    // Subscribe to DETAIL DATA
    this.detailService.getDetailData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DetailData) => {
        if (response) {
          console.log(response);
          this.detailData = response;

          if (!response.historicData.hasHistoricSearch) {
            this.isSidebarHide = response.isMainHistoricTab;
          }

          this.filterList = new Array<string>();
          if (!response.isMainHistoricTab) {
            this.filterList = this.currentFilterList;
          } else {
            this.filterList = this.historicFilterList;
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

    // this.dataService.filter$
    //   .subscribe((data: FilterSend) => {
    //     this.hasFilter = data.hasFilter;
    //     this.filterList.push(data.serialFilter);
    //   });
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  public restartCurrentFilters(): void {
    this.detailService.setLoading(true);
    this.equipmentService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        if (response) {
          this.equipmentData.setEventFromSidebar(response, this.detailData.isMainHistoricTab);
          this.detailService.setEquipments(this.equipmentData);

          this.filterList = new Array<string>();
          this.hasFilter = false;
          this.hasTypeFilter = false;
          this.serialFilter = '';
        }
      });
  }

  public restartHistoricFilters(): void{
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

          this.filterList = new Array<string>();
          this.hasFilter = false;
          this.hasTypeFilter = false;
          this.serialFilter = '';
        }
      }));
  }

  public searchByFilter(filter: FilterData): void {
    this.detailService.setLoading(true);

    setTimeout(() => {
      const predicate = this.getFilterPredicate(filter);
      const equipmentsFiltered = this.equipmentData.equipments.filter(predicate);
      this.equipmentData.setEventFromSidebar(equipmentsFiltered, this.detailData.isMainHistoricTab);
      this.hasFilter = true;

      if (filter.group === 'Equipo'){
        this.hasTypeFilter = true;
        this.model = this.SetFilterDetail('Modelo');
        this.brand = this.SetFilterDetail('Marca');
      }

      if (!this.detailData.isMainHistoricTab) {
        this.hasCurrentFilter = true;
      } else {
        this.hasHistoricFilter = true;
      }

      this.breadcrumbsHandler(filter.value);
      this.detailService.setEquipments(this.equipmentData);
    }, 250);
  }

  private breadcrumbsHandler(filter: string){
    if (!this.detailData.isMainHistoricTab) {
      this.currentFilterList.push(filter);
    } else {
      this.historicFilterList.push(filter);
    }
  }

  public searchBySerial = (value: any): void => {
    // if (this.serialForm.valid){
    //   const serialFiltered = this.equipments.filter(x => x.serial == value.serial);
    //   const historicData = new HistoricDataSend(serialFiltered, false);
    //   // this.dataService.hitorics$.emit(historicData);

    //   this.filterList.push(value.serial);
    //   this.serialForm.controls.serial.setValue('');
    //   this.hasFilter = true;
    // }
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
      // tslint:disable-next-line: forin
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
