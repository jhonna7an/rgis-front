import { EquipmentRead } from './../../../../models/equipments/equipment';
import { TabHandler } from './../TabHandler';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { FilterSend, MultiEditData } from 'src/app/modules/main/models/pages/equipment-detail';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';

@Component({
  selector: 'app-current-detail',
  templateUrl: './current-detail.component.html',
  styleUrls: ['./current-detail.component.css']
})
export class CurrentDetailComponent extends BaseComponent implements OnInit {

  public serialForm: FormGroup;
  public equipments: EquipmentRead[];

  public isEnableMultiEdit: boolean;
  public isDisableMultiEditBtn: boolean;

  public _tabHandler: TabHandler;

  @Input()
  set tabHandler(value: TabHandler) {
    if (value && value.isDetailTab) {
      this.serialForm.reset()
      this._tabHandler = value;
    }
  }

  get tabHandler(): TabHandler {
    return this._tabHandler;
  }

  constructor(
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    public dialog: MatDialog
  ) {
    super();
    this.isEnableMultiEdit = false;
    this.isDisableMultiEditBtn = true;
   }

  ngOnInit(): void {
    this.createSerialForm();

    //Get Equipments from Server
    this.equipmentService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentRead[]) => {
        console.log(response);
        this.equipments = response;
        this.isDisableMultiEditBtn = false;
      });

    //Get Equipments from Subject
    this.equipmentService.getEquipmentsSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentRead[]) => {
        this.equipments = response;
      })

    this.equipmentService.getMultiEditData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: MultiEditData) => {
        this.isEnableMultiEdit = response.isEnableMultiEdit;
      });
  }

  private createSerialForm(): void{
    this.serialForm = this.formBuilder.group({
      serial: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)
      ])]
    });
  }

  public onSubmit(value: any): void {
    if (this.serialForm.valid){
      this.serialForm.controls['serial'].reset();
      const filterData = new FilterSend(true, value.serial);
      // this.dataService.filter$.emit(filterData);

      const filterBySerial = this.equipments.filter(x => x.serial.toString() === value.serial);
      // this.dataService.equipment$.emit(filterBySerial);
    }
  }

  //Multi edit Event
  public triggerMultiEdit(isEditEvent: boolean): void {
    this.isEnableMultiEdit = !this.isEnableMultiEdit;
    const multiEditData = new MultiEditData(this.isEnableMultiEdit, isEditEvent);
    this.equipmentService.setMultiEditData(multiEditData);
  }

  //Form Validation
  public validateControl = (control: string) => {
    if (this.serialForm.controls[control].invalid && this.serialForm.controls[control].touched){
      return true;
    }

    return false;
  }

  public hasError = (control: string, error: string) => {
    if (this.serialForm.controls[control].hasError(error)){
      return true;
    }

    return false;
  }
}
