import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { EquipmentAssignmentType } from 'src/app/modules/main/models/equipments/equipment-assignment-type.model';
import { Employee } from 'src/app/modules/main/models/Manager/employee';
import { EmployeeService } from 'src/app/modules/main/services/employee.service';
import { EquipmentAssignmentTypeService } from 'src/app/modules/main/services/equipment-assignment-type.service';
import { LocationService } from 'src/app/modules/main/services/location.service';
import { EquipmentLocation } from '../../../../models/equipments/location';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']
})
export class CreateAssignmentComponent extends BaseComponent implements OnInit {

  public isLoading: boolean;
  public assignmentForm: FormGroup;

  public assignmentsType: EquipmentAssignmentType[];
  public locations: EquipmentLocation[];
  public employees: Employee[];

  constructor(
    private dialogRef: MatDialogRef<CreateAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Equipment,
    private locationService: LocationService,
    private assignmentTypesService: EquipmentAssignmentTypeService,
    private employeeervice: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getAssignmentsType();
    this.getLocations();
    this.getEmployees();
  }

  public submit(): void {

    console.log(this.assignmentForm.value);

  }

  private initForm(): void {
    this.assignmentForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      client: [''],
      employee: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  public getControl(value: string): AbstractControl {
    return this.assignmentForm.controls[value];
  }

  private getAssignmentsType(): void{
    this.assignmentTypesService
      .getTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentAssignmentType[]) => {
        if (response) {
          this.assignmentsType = response
        }
      }, error => console.log(error));
  }

  private getLocations(): void{
    this.locationService
      .Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentLocation[]) => {
        if (response) {
          this.locations = response;
        }
      });
  }

  private getEmployees(): void{
    this.employeeervice
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Employee[]) => {
        if (response) {
          this.employees = response;
        }
      });
  }
}
