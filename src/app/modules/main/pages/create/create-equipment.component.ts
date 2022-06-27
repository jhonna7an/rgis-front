import { ToastService } from 'src/app/services/toast.service';
import { EquipmentType } from '../../models/equipments/equipment-type';
import { EquipmentTypeService } from '../../services/equipment-name.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { District } from '../../models/equipments/district';
import { EquipmentAbm } from '../../models/equipments/equipment';
import { EquipmentBrand } from '../../models/equipments/equipment-brand';
import { EquipmentModel } from '../../models/equipments/equipment-model';
import { BrandService } from '../../services/brand.service';
import { DistrictService } from '../../services/district.service';
import { EquipmentService } from '../../services/equipment.service';
import { ModelService } from '../../services/model.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.css']
})
export class CreateEquipmentComponent extends BaseComponent implements OnInit {

  public createForm: FormGroup;
  public types: EquipmentType[];
  public brands: EquipmentBrand[];
  public models: EquipmentModel[];
  public districts: District[];

  public loading: boolean;
  public isBrandDisabled: boolean;
  public isModelDisabled: boolean;
  public isBranchOfficeDisabled: boolean;

  public excelData: [][];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private districtService: DistrictService,
    private equipmentService: EquipmentService,
    private nameService: EquipmentTypeService,
    private toastService: ToastService
  ) {
    super();
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
  private initCreateForm(): void {
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

  public saveCreate(value: any): void {
    const equipment = new EquipmentAbm();
    equipment.completeCreate(value);
    this.equipmentService.create(equipment)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        this.createForm.reset();
        this.resetHandle();
        this.toastService.showSuccess('Se completó la solicitud correctamente.');
      }, error => {
        this.createForm.reset();
        this.toastService.showError('Ocurrió un error al intentar procesar la solicitud.');
        console.error(error);
      });
  }

  public onChangeType(value: any): void {
    this.loading = true;
    this.isBrandDisabled = false;
    this.isModelDisabled = false;
    this.brandService.get(value)
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentType[]) => {
        if (response) {
          this.types = response;
          this.loading = false;
        }
      });
  }

  private getDistricts(): void{
    this.loading = true;
    this.districtService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: District[]) => {
        this.districts = response;
        this.loading = false;
      }, error => {
        console.error(error);
      });
  }

  private resetHandle(){
    this.fm['type'].reset();
    this.fm['type'].markAsUntouched();
    this.fm['serial'].markAsUntouched();
    this.fm['marca'].markAsUntouched();
    this.fm['model'].markAsUntouched();
    this.fm['inService'].markAsUntouched();
    this.fm['district'].markAsUntouched();
  }
  //#endregion
}
