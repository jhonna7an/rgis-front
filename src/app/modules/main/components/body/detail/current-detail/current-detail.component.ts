import {
  DetailData,
  EquipmentData,
  FilterSend,
  MultiEditData,
} from 'src/app/modules/main/models/detailData.model';
import { Equipment } from './../../../../models/equipments/equipment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { DetailService } from 'src/app/modules/main/services/workflow/detail.service';

@Component({
  selector: 'app-current-detail',
  templateUrl: './current-detail.component.html',
  styleUrls: ['./current-detail.component.css'],
})
export class CurrentDetailComponent extends BaseComponent implements OnInit {
  public serialForm: FormGroup;
  public equipments: Equipment[];

  public isEnableMultiEdit: boolean;
  public isDisableMultiEditBtn: boolean;

  public detailData: DetailData;
  public equipmentData: EquipmentData;

  constructor(
    private equipmentService: EquipmentService,
    private detailService: DetailService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.isEnableMultiEdit = false;
    this.isDisableMultiEditBtn = true;
    this.equipmentData = new EquipmentData();
  }

  ngOnInit(): void {
    this.createSerialForm();
    this.getEquipments();

    // Subscribe DetailData for dialogs
    this.detailService
      .getDetailData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DetailData) => {
        if (response) {
          this.detailData = response;

          if (!response.isMainHistoricTab) {
            this.equipmentData.setEventFromBody(this.equipments);
            this.detailService.setEquipments(this.equipmentData);
          }
        }
      });

    // Restart Equipments after Edit
    this.equipmentService
      .restartEquipmentsEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getEquipments();
      });

    // Get Equipments from Subject
    this.detailService
      .getEquipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentData) => {
        if (response && response.isSidebarEvent && !response.isHistoricTab) {
          console.log(response);

          this.equipments = response.equipments;
        }
      });

    // Manage Multi Edit
    this.equipmentService
      .getMultiEditData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: MultiEditData) => {
        this.isEnableMultiEdit = response.isEnableMultiEdit;
      });
  }

  private createSerialForm(): void {
    this.serialForm = this.formBuilder.group({
      serial: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
      ],
    });
  }

  public onSubmit(value: any): void {
    if (this.serialForm.valid) {
      this.serialForm.controls['serial'].reset();
      this.equipments = this.equipments.filter(x => x.serial === value.serial);
      this.equipmentData.setEventFromBody(this.equipments, value.serial);
      this.detailService.setEquipments(this.equipmentData);
    }
  }

  // Multi edit Event
  public triggerMultiEdit(isEditEvent: boolean): void {
    this.isEnableMultiEdit = !this.isEnableMultiEdit;
    const multiEditData = new MultiEditData(
      this.isEnableMultiEdit,
      isEditEvent
    );
    this.equipmentService.setMultiEditData(multiEditData);
  }

  // Form Validation
  public validateControl = (control: string) => {
    if (this.serialForm.controls[control].invalid &&
      this.serialForm.controls[control].touched) {
      return true;
    }

    return false;
  };

  public hasError = (control: string, error: string) => {
    if (this.serialForm.controls[control].hasError(error)) {
      return true;
    }

    return false;
  };

  // Get Equipments from Server
  private getEquipments(): void {
    this.equipmentService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        this.equipments = response;
        this.isDisableMultiEditBtn = false;

        this.equipmentData.setEventFromBody(response);
        this.detailService.setEquipments(this.equipmentData);
      });
  }
}
