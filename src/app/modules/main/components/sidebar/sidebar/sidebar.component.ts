import { Component, Input, OnInit, Output, EventEmitter, Predicate, OnDestroy } from '@angular/core';
import { Equipment } from '../../../models/equipments/equipment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { FilterData, FilterDetail, FilterDetailItem, FilterSend, HistoricDataSend } from '../../../models/pages/equipment-detail';
import { EquipmentService } from '../../../services/equipment.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  private equipments: Equipment[];
  private historicsBackup: Equipment[];

  private equipmentSubscription: Subscription;
  private historicsSubscription: Subscription;
  private filterSubscription: Subscription;
  public loading: boolean;

  public hasFilter: boolean;
  public hasTypeFilter: boolean;
  public serialFilter: string;
  public filterList: string[];

  public _isHistoricTab: boolean;
  public isSidebarHide: boolean;

  public type: FilterDetail;
  public district: FilterDetail;
  public location: FilterDetail;
  public state: FilterDetail;
  public model: FilterDetail;
  public brand: FilterDetail;

  public serialForm: FormGroup;

  @Input()
  public set isHistoricTab(value: boolean){
    if (value != null) {
      this.loading = true;
      this._isHistoricTab = value;
      this.isSidebarHide = value;
      this.hasFilter = false;
      this.filterList = new Array<string>();
      this.createSerialForm();
    }
  }

  public get isHistoricTab(): boolean {
    return this._isHistoricTab;
  }

  constructor( private formBuilder: FormBuilder,
               private dataService: DataService,
               private equipmentService: EquipmentService ) {
    this.loading = false;
    this.filterList = new Array<string>();
    this.hasTypeFilter = false;
    this.hasFilter = false;
    this.isSidebarHide = false;
  }

  ngOnInit(): void {
    this.equipmentSubscription = this.dataService.equipment$
      .subscribe((equipments: Equipment[]) => {
        if (equipments) {
          this.equipments = equipments;
          this.setFilters();
        }
      });

    this.filterSubscription = this.dataService.filter$
      .subscribe((data: FilterSend) => {
        this.hasFilter = data.hasFilter;
        this.filterList.push(data.serialFilter);
      });

    this.historicsSubscription = this.dataService.hitorics$
      .subscribe((data: HistoricDataSend) => {
        if (data) {
          setTimeout(() => this.loading = false, 500);
          this.equipments = data.historics;
          this.isSidebarHide = false;
          this.setFilters();
          if (data.isFirstHistoricCall) {
            this.historicsBackup = data.historics;
          }

          if (data.isHistoricTab != null) {
            this.isHistoricTab = data.isHistoricTab;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.equipmentSubscription.unsubscribe();
    this.historicsSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public restartFilters(): void{
    this.loading = true;
    this.filterList = new Array<string>();
    if (!this._isHistoricTab) {
      this.equipmentService.get()
        // .subscribe((response: Equipment[]) => {
        //   this.equipments = response;
        //   this.dataService.equipment$.emit(this.equipments);
        // });
    } else {
      const historicsBackup = new HistoricDataSend(this.historicsBackup, true);
      this.dataService.hitorics$.emit(historicsBackup);
    }

    this.hasFilter = false;
    this.hasTypeFilter = false;
    this.serialFilter = '';
  }

  public searchByFilter = (filter: FilterData): void => {
    const predicate = this.getFilterPredicate(filter);
    this.equipments = this.equipments.filter(predicate);
    this.hasFilter = true;
    if (filter.group === 'Equipo'){
      this.hasTypeFilter = true;
      this.model = this.SetFilterDetail('Modelo');
      this.brand = this.SetFilterDetail('Marca');
    }

    this.filterList.push(filter.value);
    if (!this._isHistoricTab) {
      this.dataService.equipment$.emit(this.equipments);
    } else {
      const historicsByFilter = new HistoricDataSend(this.equipments, false);
      this.dataService.hitorics$.emit(historicsByFilter);
    }
  }

  public searchBySerial = (value: any): void => {
    if (this.serialForm.valid){
      const serialFiltered = this.equipments.filter(x => x.serial == value.serial);
      const historicData = new HistoricDataSend(serialFiltered, false);
      this.dataService.hitorics$.emit(historicData);

      this.filterList.push(value.serial);
      this.serialForm.controls.serial.setValue('');
      this.hasFilter = true;
    }
  }

  private setFilters(): void{
    this.type = this.SetFilterDetail('Equipo');
    this.district = this.SetFilterDetail('Distrito');
    this.location = this.SetFilterDetail('Ubicación');
    this.state = this.SetFilterDetail('Estado');
    this.model = this.SetFilterDetail('Modelo');
    this.brand = this.SetFilterDetail('Marca');
    setTimeout(() => this.loading = false, 500);
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
    if (this.equipments){
      const filterGrouping = this.equipments.reduce((result: any, equipment: Equipment) => ({
        ...result, [this.getFilterParam(title, equipment)]: [ ...(result[this.getFilterParam(title, equipment)] || []), equipment ],
      }), {});

      const groupLength = Object.getOwnPropertyNames(filterGrouping).length;
      const sidebarFilter = new Array<FilterDetailItem>();
      for (const item in filterGrouping){
        const models: Equipment[] = filterGrouping[item];
        sidebarFilter.push(new FilterDetailItem(item, models.length));
      }
      return new FilterDetail(title, sidebarFilter, groupLength);
    }
  }

  private getFilterParam(filter: string, equipment: Equipment): string{
    switch (filter) {
      case 'Equipo':
        return equipment.model.name.name;
      case 'Distrito':
        return equipment.branchOffice.district.districtName;
      case 'Ubicación':
        return equipment.location.name;
      case 'Estado':
        return equipment.state.state;
      case 'Modelo':
        return equipment.model.model;
      case 'Marca':
        return equipment.model.brand.brand;
    }
  }

  private getFilterPredicate = (filter: FilterData): Predicate<Equipment> => {
    switch (filter.group) {
      case 'Equipo':
        return (x: Equipment) => x.model.name.name === filter.value;
      case 'Distrito':
        return (x: Equipment) => x.branchOffice.district.districtName === filter.value;
      case 'Ubicación':
        return (x: Equipment) => x.location.name === filter.value;
      case 'Estado':
        return (x: Equipment) => x.state.state === filter.value;
      case 'Modelo':
        return (x: Equipment) => x.model.model === filter.value;
      case 'Marca':
        return (x: Equipment) => x.model.brand.brand === filter.value;
      default:
        break;
    }
  }
}
