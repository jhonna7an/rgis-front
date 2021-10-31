import { EEquipmentState } from './../../../../../pages/summary/summarytable';
import { Equipment, EquipmentAbm } from './../../../../../models/equipments/equipment';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { DetailData } from './../../../../../models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../../../core/components/base/base.component';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchOffice } from 'src/app/modules/main/models/manager/branch-office';
import { BranchOfficeService } from 'src/app/modules/main/services/branch-office.service';
import { District } from 'src/app/modules/main/models/equipments/district';
import { DistrictService } from 'src/app/modules/main/services/district.service';
import { EquipmentLocation } from 'src/app/modules/main/models/equipments/location';
import { EquipmentValoration } from 'src/app/modules/main/models/equipments/equipment-valoration';
import { EquipmentState } from 'src/app/modules/main/models/equipments/equipment-state';
import { EquipmentStateService } from 'src/app/modules/main/services/equipment-state.service';
import { EquipmentValorationService } from 'src/app/modules/main/services/equipment-valoration.service';
import { LocationService } from 'src/app/modules/main/services/location.service';
import { Historic } from 'src/app/modules/main/models/equipments/historicEquipment';

@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html',
  styleUrls: ['./detail-item.component.css']
})
export class DetailItemComponent extends BaseComponent implements OnInit {

  public _detailData: DetailData;
  public historic: Historic;

  public editForm: FormGroup;
  public showBranchOffice: boolean;

  public branchOffices: BranchOffice[];
  public districts: District[];
  public locations: EquipmentLocation[];
  public valorations: EquipmentValoration[];
  public states: EquipmentState[];

  @Input()
  set detailData(value: DetailData) {
    if (value) {
      this._detailData = value;

      if (this.isHistoricType(value.equipment)) {
        this.historic = value.equipment;
      }

      if (value.isEditModule) {
        this.GetDropDownData();
      }
    }
  }

  get detailData(): DetailData {
    return this._detailData;
  }

  constructor(
    private equipmentService: EquipmentService,
    private branchOfficeService: BranchOfficeService,
    private districtService: DistrictService,
    private locationService: LocationService,
    private valorationService: EquipmentValorationService,
    private stateService: EquipmentStateService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  get ef(): any {
    return this.editForm.value;
  }

  ngOnInit(): void {
    this.initEditForm();

    // Subscriber get equipment info to edit
    this.equipmentService.saveEditListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          const equipment = new EquipmentAbm();
          equipment.completeToEdit(this.ef, this.detailData.equipment, 1);

          if (equipment.stateId === EEquipmentState.Averia) {
            this.equipmentService.setFaultCreate(equipment);
          } else {
            this.equipmentService.setEquipmentToEdit(equipment);
          }
        }
      });
  }

  public isHistoricType(params: Equipment): params is Historic {
    return (params as Historic).equipmentId !== undefined;
  }

  public onChangeDistrict = (value: number): void => {
    this.GetBranchOffices(value);
    this.showBranchOffice = true;
  }

  private GetBranchOffices(districtId: number): void {
    this.branchOfficeService.Get(districtId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: BranchOffice[]) => {
          this.branchOffices = response;
      }, error => {
        console.error(error);
      });
  }

  private GetDistricts(): void {
    this.districtService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: District[]) => {
        this.districts = response;
      }, error => {
        console.error(error);
      });
  }

  private GetStates(): void {
    this.stateService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentState[]) => {
        this.states = response;
      }, error => {
        console.error(error);
      });
  }

  private GetLocations = (): void => {
    this.locationService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentLocation[]) => {
          this.locations = response;
      }, error => {
        console.error(error);
      });
  }

  private GetValoration(): void {
    this.valorationService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentValoration[]) => {
        this.valorations = response;
      }, error => {
        console.error(error);
      });
  }

  private GetDropDownData(): void {
    this.GetDistricts();
    this.GetLocations();
    this.GetStates();
    this.GetValoration();
    this.GetBranchOffices(this.detailData.equipment.districtId);
  }

  private initEditForm(): void {
    this.editForm = this.formBuilder.group({
      district: [this.detailData.equipment.districtId, Validators.required],
      branchOffice: [this.detailData.equipment.branchOfficeId, Validators.required],
      location: [this.detailData.equipment.locationId, Validators.required],
      state: [this.detailData.equipment.stateId, Validators.required],
      valoration: [this.detailData.equipment.valorationId, Validators.required],
      inservices: [this.detailData.equipment.inServices, Validators.required],
      datein: [this.detailData.equipment.creationDate, Validators.required]
    });
  }
}
