import { EquipmentName } from './../../models/equipments/equipment-name';
import { EquipmentNameService } from './../../services/equipment-name.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { District } from '../../models/equipments/district';
import { EquipmentAbm } from '../../models/equipments/equipment';
import { EquipmentBrand } from '../../models/equipments/equipment-brand';
import { EquipmentModel } from '../../models/equipments/equipment-model';
import { BranchOffice } from '../../models/manager/branch-office';
import { BranchOfficeService } from '../../services/branch-office.service';
import { BrandService } from '../../services/brand.service';
import { DistrictService } from '../../services/district.service';
import { EquipmentService } from '../../services/equipment.service';
import { ModelService } from '../../services/model.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.css']
})
export class CreateEquipmentComponent implements OnInit {

  public createForm: FormGroup;

  public types: EquipmentName[];
  public brands: EquipmentBrand[];
  public models: EquipmentModel[];
  public districts: District[];
  public branchOffices: BranchOffice[];

  public loading: boolean;
  public isBrandDisabled: boolean;
  public isModelDisabled: boolean;
  public isBranchOfficeDisabled: boolean;

  constructor(private formBuilder: FormBuilder,
              private brandService: BrandService,
              private modelService: ModelService,
              private districtService: DistrictService,
              private branchOfficeService: BranchOfficeService,
              private equipmentService: EquipmentService,
              private nameService: EquipmentNameService,
              private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.loading = false;
    this.isBrandDisabled = false;
    this.isModelDisabled = false;
    this.isBranchOfficeDisabled = false;
    this.initCreateForm();
    this.getTypes();
    this.getDistricts();
  }

  get fm(){
    return this.createForm.controls;
  }

  private initCreateForm(){
    this.createForm = this.formBuilder.group(
      {
        type: ['', Validators.required],
        serial: ['', Validators.compose(
          [
            Validators.required,
            Validators.pattern(/^[0-9]*$/)
          ]
        )],
        serialFactory: [''],
        marca: ['', Validators.required],
        model: ['', Validators.required],
        inService: [this.currentDate, Validators.required],
        district: ['', Validators.required],
        branchOffice: ['', Validators.required]
      }
    );
  }

  public saveEquipment(value: any){
    const equipment = new EquipmentAbm();
    equipment.setCreateInfo(value.serial, value.serialFactory, value.model, value.InService, value.branchOffice);
    console.log(equipment);
    this.equipmentService.create(equipment)
      .subscribe((response: boolean) => {
        this.openSnackBar(response);
        console.log(response);
      }, error => {
        console.error(error);
      });
  }

  public onChangeType(value: any): void {
    this.loading = true;
    this.isBrandDisabled = false;
    this.isModelDisabled = false;
    this.brandService.get(value)
      .subscribe((response: EquipmentBrand[]) => {
        this.isBrandDisabled = true;
        this.brands = response;
        this.fm['marca'].reset();
        this.fm['model'].reset();
        this.fm['marca'].markAsUntouched();
        this.fm['model'].markAsUntouched();
        this.loading = false;
      });
  }

  public onChangeBrand(value): void{
    this.loading = true;
    this.isModelDisabled = false;
    const typeId = this.createForm.controls['type'].value;
    this.modelService.Get(value, typeId)
      .subscribe((response: EquipmentModel[]) => {
        this.isModelDisabled = true;
        this.models = response;
        this.fm['model'].reset();
        this.fm['model'].markAsUntouched();
        this.loading = false;
      }, error => {
        console.error(error);
      });
  }

  public onChangeDistrict(value: any): void{
    this.loading = true;
    this.branchOfficeService.Get(value)
      .subscribe((response: BranchOffice[]) => {
        this.isBranchOfficeDisabled = true;
        this.branchOffices = response;
        this.fm['branchOffice'].reset();
        this.fm['branchOffice'].markAsUntouched();
        this.loading = false;
      }, error => {
        console.error(error);
      });
  }

  private getTypes(): void {
    this.loading = true;
    this.nameService.get()
      .subscribe((response: EquipmentName[]) => {
        if (response) {
          this.types = response;
          this.loading = false;
        }
      });
  }

  private getDistricts(): void{
    this.loading = true;
    this.districtService.Get()
      .subscribe((response: District[]) => {
        this.districts = response;
        this.loading = false;
      }, error => {
        console.error(error);
      });
  }

  private openSnackBar = (flag: boolean) => {
    const class_style = flag ? 'snackBar-success' : 'snackBar-error';
    const message = flag ? 'Se completo la solicitud correctamente' : 'Se produjo un error al intentar procesar la solicitud';
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [class_style]
    });
  }

  get currentDate(): Date {
    return new Date();
  }
}
