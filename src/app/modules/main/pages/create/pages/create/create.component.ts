import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { District } from 'src/app/models/district.model';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { DistrictService } from 'src/app/modules/main/equipment.module';
import { EquipmentBrand } from 'src/app/modules/main/models/equipments/equipment-brand';
import { EquipmentModel } from 'src/app/modules/main/models/equipments/equipment-model';
import { EquipmentType } from 'src/app/modules/main/models/equipments/equipment-type';
import { BrandService } from 'src/app/modules/main/services/brand.service';
import { EquipmentTypeService } from 'src/app/modules/main/services/equipment-name.service';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { ModelService } from 'src/app/modules/main/services/model.service';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastService } from 'src/app/services/toast.service';

import { EquipmentCreate } from '../../models/equipment-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent extends BaseComponent implements OnInit {

  public createForm: FormGroup;
  public brands: EquipmentBrand[];
  public models: EquipmentModel[];

  public types$: Observable<EquipmentType[]>;
  public districts$: Observable<District[]>;

  public loading: boolean;
  public excelData: [][];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private districtService: DistrictService,
    private equipmentService: EquipmentService,
    private typeService: EquipmentTypeService,
    private toastService: ToastService,
    private applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    this.initCreateForm();

    this.types$ = this.typeService.get();
    this.districts$ = this.districtService.get();
  }

  get fm(){
    return this.createForm.controls;
  }

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
        brand: [{ value: '', disabled: true }, Validators.required],
        model: [{ value: '', disabled: true }, Validators.required],
        inService: [new Date(), Validators.required],
        district: ['', Validators.required]
      }
    );
  }

  public getControl(value: string): AbstractControl {
    return this.createForm.controls[value];
  }

  public saveCreate(): void {
    const user = this.applicationService.getByKey('user');
    const userObject = JSON.parse(user);

    const equipmentCreate = new EquipmentCreate();
    equipmentCreate.completeCreate(this.createForm.value, userObject.id);

    this.equipmentService
      .create(equipmentCreate)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        this.toastService.showSuccess('Se completó la solicitud correctamente.');
      }, error => {
        this.toastService.showError('Ocurrió un error al intentar procesar la solicitud.');
        console.error(error);
      })
      .add(() => {
        this.createForm.reset();
        this.createForm.markAsUntouched();
        this.getControl('type').setErrors(null);
        this.getControl('brand').setErrors(null);
        this.getControl('model').setErrors(null);
        this.getControl('serial').setErrors(null);
        this.getControl('inService').setErrors(null);
        this.getControl('district').setErrors(null);
      });
  }

  public onChangeType(value: any): void {
    this.loading = true;

    this.brandService
    .get(value)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: EquipmentBrand[]) => {
        this.getControl('brand').enable();
        this.brands = response;
        this.loading = false;
      });
  }

  public onChangeBrand(value: any): void{
    this.loading = true;
    const typeId = this.createForm.controls['type'].value;

    this.modelService
      .get(value, typeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentModel[]) => {
        this.getControl('model').enable();
        this.models = response;
        this.loading = false;
      }, error => {
        console.error(error);
      });
  }
}
