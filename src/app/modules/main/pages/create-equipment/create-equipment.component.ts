import { EquipmentName } from './../../models/equipments/equipment-name';
import { EquipmentNameService } from './../../services/equipment-name.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { District } from '../../models/equipments/district';
import { EquipmentAbm } from '../../models/equipments/equipment';
import { EquipmentBrand } from '../../models/equipments/equipment-brand';
import { EquipmentModel } from '../../models/equipments/equipment-model';
import { BranchOffice } from '../../models/manager/branch-office';
import { BrandService } from '../../services/brand.service';
import { DistrictService } from '../../services/district.service';
import { EquipmentService } from '../../services/equipment.service';
import { ModelService } from '../../services/model.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

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

  public loading: boolean;
  public isBrandDisabled: boolean;
  public isModelDisabled: boolean;
  public isBranchOfficeDisabled: boolean;

  public excelData: [][];

  constructor(private formBuilder: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private districtService: DistrictService,
    private equipmentService: EquipmentService,
    private nameService: EquipmentNameService,
    private snackBar: MatSnackBar) {

  }

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

  //#region CREATE FORM
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
        inService: [new Date(), Validators.required],
        district: ['', Validators.required]
      }
    );
  }

  public saveCreate(value: any){
    const equipment = new EquipmentAbm();
    equipment.completeCreate(value);
    this.equipmentService.create(equipment)
      .subscribe((response: boolean) => {
        this.createForm.reset();
        console.log(this.createForm.valid);

        this.openSnackBar(response);
      }, error => {
        this.createForm.reset();
        this.openSnackBar(false);
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
  //#endregion

  //SNACKBAR
  private openSnackBar = (flag: boolean) => {
    const class_style = flag ? 'snackBar-success' : 'snackBar-error';
    const message = flag ? 'Se completó la solicitud correctamente' : 'Se produjo un error al intentar procesar la solicitud';
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [class_style]
    });
  }

  public showMessage = (messageEvent: any) => {
    console.log(messageEvent);

    const class_style = messageEvent.flag ? 'snackBar-success' : 'snackBar-error';
    this.snackBar.open(messageEvent.message, '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [class_style]
    });
  }
}
