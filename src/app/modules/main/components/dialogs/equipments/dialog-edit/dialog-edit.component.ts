import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { District } from 'src/app/modules/main/models/equipments/district';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { DistrictService } from '../../../../services/district.service';
import { LocationService } from '../../../../services/location.service';
import { EquipmentValorationService } from '../../../../services/equipment-valoration.service';
import { EquipmentStateService } from '../../../../services/equipment-state.service';
import { EquipmentLocation } from '../../../../models/equipments/location';
import { EquipmentValoration } from '../../../../models/equipments/equipment-valoration';
import { EquipmentState } from '../../../../models/equipments/equipment-state';
import { EquipmentService } from '../../../../services/equipment.service';
import { BranchOffice } from '../../../../models/manager/branch-office';
import { BranchOfficeService } from 'src/app/modules/main/services/branch-office.service';
import { EquipmentAbm } from '../../../../models/equipments/equipment';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.css']
})
export class DialogEditComponent implements OnInit {

  public loading: boolean;
  public editForm: FormGroup;

  public districts: District[];
  public branchOffices: BranchOffice[];
  public locations: EquipmentLocation[];
  public valorations: EquipmentValoration[];
  public states: EquipmentState[];

  public showBranchOffice: boolean;
  public showInputsInMultiEdit: boolean;

  constructor(public dialogRef: MatDialogRef<DialogEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private equipmentService: EquipmentService,
              private districtService: DistrictService,
              private branchOfficeService: BranchOfficeService,
              private locationService: LocationService,
              private valorationService: EquipmentValorationService,
              private stateService: EquipmentStateService,
              private formBuilder: FormBuilder) {
    this.loading = true;
    this.showBranchOffice = data.isMultiEdit ? false : true;
    this.showInputsInMultiEdit = data.isMultiEdit ? false : true;
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed()
      .subscribe(() => this.dialogRef.close('closed'));

    this.initEditForm();
    this.GetDropDownData();
  }

  public onChangeDistrict = (value: number): void => {
    this.GetBranchOffices(value);
    this.showBranchOffice = true;
  }

  public editEquipment(value: any): void {
    console.log(value);
    const equipment = this.createEquipmentAbmList(value);
    const editedSubs = this.equipmentService.editEquipment(equipment)
      .subscribe((response: boolean) => {
        this.equipmentService.edited$.emit(response);
        this.dialogRef.close();
        editedSubs.unsubscribe();
      }, error => {
        console.error(error);
        this.equipmentService.edited$.emit(false);
      });
  }

  public validateControl(control: string): boolean {
    if (this.editForm.controls[control].invalid && this.editForm.controls[control].touched){
      return true;
    }

    return false;
  }

  public hasError(control: string, error: string): boolean {
    if (this.editForm.controls[control].hasError(error)){
      return true;
    }

    return false;
  }

  public close($event: any): void {
    this.dialogRef.close();
    $event.preventDefault();
  }

  private initEditForm(): void {
    let controls = {};
    if (this.data.isMultiEdit) {
      controls = {
        district: this.formBuilder.control(''),
        branchOffice: [''],
        location: [''],
        state: [''],
        valoration: [''],
        inservices: [''],
        datein: [''],
        comments: this.formBuilder.array([
          this.formBuilder.control('')
        ])
      };
    } else {
      controls = {
        district: [this.data.equipments[0]?.branchOffice.district.id, Validators.required],
        branchOffice: [this.data.equipments[0]?.branchOffice.id, Validators.required],
        location: [this.data.equipments[0]?.location.id, Validators.required],
        state: [this.data.equipments[0]?.state.id, Validators.required],
        valoration: [this.data.equipments[0]?.valoration.id, Validators.required],
        inservices: [this.data.equipments[0]?.inServices, Validators.required],
        datein: [this.data.equipments[0]?.creationDate, Validators.required],
        comments: new FormArray([])
      };
    }

    this.editForm = this.formBuilder.group(controls);
  }

  private GetDropDownData(): void {
    this.GetDistricts();
    this.GetLocations();
    this.GetStates();
    this.GetValoration();
    if (!this.data.isMultiEdit) {
      this.GetBranchOffices(this.data.equipments[0]?.branchOffice.district.id);
    }
    this.loading = false;
  }

  private GetDistricts = (): void => {
    const districts$ = this.districtService.Get()
      .subscribe((response: District[]) => {
        this.districts = response;
      }, error => {
        console.error(error);
      });
  }

  private GetLocations = (): void => {
    const location$ = this.locationService.Get()
      .subscribe((response: EquipmentLocation[]) => {
          this.locations = response;
      }, error => {
        console.error(error);
      });
  }

  private GetBranchOffices(districtId: number): void {
    const branchOffice$ = this.branchOfficeService.Get(districtId)
      .subscribe((response: BranchOffice[]) => {
          this.branchOffices = response;
      }, error => {
        console.error(error);
      });
  }

  private GetStates(): void {
    const districts$ = this.stateService.Get()
      .subscribe((response: EquipmentState[]) => {
        this.states = response;
      }, error => {
        console.error(error);
      });
  }

  private GetValoration(): void {
    const districts$ = this.valorationService.Get()
      .subscribe((response: EquipmentValoration[]) => {
        this.valorations = response;
      }, error => {
        console.error(error);
      });
  }

  private createEquipmentAbmList(formValue: any): EquipmentAbm[]{
    const equipments = new Array<EquipmentAbm>();

    for (const equipment of this.data.equipments) {
      equipments.push(new EquipmentAbm(equipment, this.data.isMultiEdit, formValue));
    }

    return equipments;
  }
}
