import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { District } from '../../models/equipments/district';
import { EquipmentBrand } from '../../models/equipments/equipment-brand';
import { EquipmentModel } from '../../models/equipments/equipment-model';
import { BranchOffice } from '../../models/manager/branch-office';
import { BranchOfficeService } from '../../services/branch-office.service';
import { BrandService } from '../../services/brand.service';
import { DistrictService } from '../../services/district.service';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.css']
})
export class CreateEquipmentComponent implements OnInit {

  public createForm: FormGroup;

  public brands: EquipmentBrand[];
  public models: EquipmentModel[];
  public districts: District[];
  public branchOffices: BranchOffice[];

  constructor(private formBuilder: FormBuilder,
              private brandService: BrandService,
              private modelService: ModelService,
              private districtService: DistrictService,
              private branchOfficeService: BranchOfficeService) { }

  ngOnInit(): void {
    this.initCreateForm();
    this.getBrands();
    this.getDistricts();
  }

  get fm(){
    return this.createForm.controls;
  }

  private initCreateForm(){
    this.createForm = this.formBuilder.group(
      {
        serial: ['', Validators.compose(
          [
            Validators.required,
            Validators.pattern(/^[0-9]*$/)
          ]
        )],
        serialFactory: [''],
        marca: ['', Validators.required],
        model: ['', Validators.required],
        InService: ['', Validators.required],
        district: ['', Validators.required],
        branchOffice: ['', Validators.required]
      }
    );
  }

  public saveEquipment(value: any){
    console.log(value);

  }

  public onChangeBrand(value): void{
    this.modelService.Get(value)
      .subscribe((response: EquipmentModel[]) => {
        this.models = response;
      }, error => {
        console.error(error);
      });
  }

  public onChangeDistrict(value: any): void{
    this.branchOfficeService.Get(value)
      .subscribe((response: BranchOffice[]) => {
        this.branchOffices = response;
      }, error => {
        console.error(error);
      });
  }

  private getBrands(): void{
    this.brandService.Get()
      .subscribe((response: EquipmentBrand[]) => {
          this.brands = response;
      }, error => {
        console.error(error);
      });
  }

  private getDistricts(): void{
    this.districtService.Get()
      .subscribe((response: District[]) => {
        this.districts = response;
      }, error => {
        console.error(error);
      });
  }
}
