import { DetailData, EquipmentData, FilterData, FilterDetail, FilterDetailItem, FilterSend, HistoricDataSend } from 'src/app/modules/main/models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Component, Input, OnInit, Predicate } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Equipment, EquipmentOther } from '../../../models/equipments/equipment';
import { DetailService } from '../../../services/workflow/detail.service';

@Component({
  selector: 'app-sidebar-detail',
  templateUrl: './sidebar-detail.component.html',
  styleUrls: ['./sidebar-detail.component.css']
})
export class SidebarDetailComponent extends BaseComponent implements OnInit {

  public detailData: DetailData;
  private equipmentData: EquipmentData;

  public hasFilter: boolean;
  public hasTypeFilter: boolean;
  public isSidebarHide: boolean;

  public serialForm: FormGroup;

  public type: FilterDetail;
  public district: FilterDetail;
  public location: FilterDetail;
  public state: FilterDetail;
  public model: FilterDetail;
  public brand: FilterDetail;

  public filterList: string[];






  private historicsBackup: EquipmentOther[];

  public isLoading: boolean;

  public serialFilter: string;

  public _isHistoricTab: boolean;




  // @Input()
  // public set isHistoricTab(value: boolean){
  //   if (value != null) {
  //     this.loading = true;
  //     this._isHistoricTab = value;
  //     this.isSidebarHide = value;
  //     this.hasFilter = false;
  //     this.filterList = new Array<string>();
  //     this.createSerialForm();
  //   }
  // }

  // public get isHistoricTab(): boolean {
  //   return this._isHistoricTab;
  // }

  constructor(
    private detailService: DetailService,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    super();
    this.filterList = new Array<string>();
    // this.isSidebarHide = true;
    this.isLoading = true;

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
          this.detailData = response;
          this.isSidebarHide = response.isMainHistoricTab;
        }
      });

    // Subscribe to EQUIPMENTS SUBJECT
    this.detailService.getEquipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentData) => {
        console.log(response);

        this.isLoading = false;
        if (response) {
          this.equipmentData = response;
          this.isSidebarHide = false;
          this.setFilters();
        }
      });




    // this.dataService.equipment$
    //   .subscribe((equipments: EquipmentOther[]) => {
    //     // if (equipments) {
    //     //   this.equipments = equipments;
    //     //   this.setFilters();
    //     // }
    //   });

    this.dataService.filter$
      .subscribe((data: FilterSend) => {
        this.hasFilter = data.hasFilter;
        this.filterList.push(data.serialFilter);
      });

    // this.dataService.hitorics$
    //   .subscribe((data: HistoricDataSend) => {
    //     // if (data) {
    //     //   setTimeout(() => this.loading = false, 500);
    //     //   this.equipments = data.historics;
    //     //   this.isSidebarHide = false;
    //     //   this.setFilters();
    //     //   if (data.isFirstHistoricCall) {
    //     //     this.historicsBackup = data.historics;
    //     //   }

    //     //   if (data.isHistoricTab != null) {
    //     //     this.isHistoricTab = data.isHistoricTab;
    //     //   }
    //     // }
    //   });
  }

  public restartFilters(): void{
    // this.loading = true;
    // this.filterList = new Array<string>();
    // if (!this._isHistoricTab) {
    //   this.equipmentService.get()
    //     // .subscribe((response: Equipment[]) => {
    //     //   this.equipments = response;
    //     //   this.dataService.equipment$.emit(this.equipments);
    //     // });
    // } else {
    //   const historicsBackup = new HistoricDataSend(this.historicsBackup, true);
    //   this.dataService.hitorics$.emit(historicsBackup);
    // }

    // this.hasFilter = false;
    // this.hasTypeFilter = false;
    // this.serialFilter = '';
  }

  public searchByFilter = (filter: FilterData): void => {

    const predicate = this.getFilterPredicate(filter);
    const equipmentsFiltered = this.equipmentData.equipments.filter(predicate);
    this.equipmentData.setEventFromSidebar(equipmentsFiltered);
    this.hasFilter = true;

    if (filter.group === 'Equipo'){
      this.hasTypeFilter = true;
      this.model = this.SetFilterDetail('Modelo');
      this.brand = this.SetFilterDetail('Marca');
    }

    this.filterList.push(filter.value);
    this.detailService.setEquipments(this.equipmentData);

    // if (!this._isHistoricTab) {
    //   this.dataService.equipment$.emit(this.equipments);
    // } else {
    //   const historicsByFilter = new HistoricDataSend(this.equipments, false);
    //   this.dataService.hitorics$.emit(historicsByFilter);
    // }
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
    // setTimeout(() => this.loading = false, 500);
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

      console.log(filterGrouping);

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
