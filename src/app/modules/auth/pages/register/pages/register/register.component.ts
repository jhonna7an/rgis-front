import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { District } from 'src/app/models/district.model';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { RegisterResult } from '../../models/register-result.model';
import { Register } from '../../models/register.model';
import { MatStepper } from '@angular/material/stepper';
import { BranchOffice } from 'src/app/models/branch-office.model';
import { DistrictService } from 'src/app/modules/shared/services/district.service';
import { BranchOfficeService } from 'src/app/modules/shared/services/branch-office.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true, displayDefaultIndicatorType: false }
    }
  ]
})
export class RegisterComponent extends BaseComponent implements OnInit {

  hide = true;
  @ViewChild('stepper') private stepper: MatStepper;
  public districts$: Observable<District[]>;
  public loading$: Observable<boolean>;
  public branchOffices: BranchOffice[];
  public isBranchOfficeDisabled: boolean;

  public isLinear: boolean = true;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;

  public registerModel: Register;
  public result: RegisterResult;

  constructor(
    private formBuilder: FormBuilder,
    private districtService: DistrictService,
    private branchOfficeService: BranchOfficeService,
    private authService: AuthService
  ) {
    super();
   }

  ngOnInit(): void {

    this.authService.setLoading(false);
    this.isBranchOfficeDisabled = true;
    this.result = new RegisterResult();
    this.registerModel = new Register();
    this.initFistForm();
    this.initSecondForm();

    this.districts$ = this.districtService.getDistricts();
    this.loading$ = this.authService.getLoading();


    this.secondFormGroup.controls['password'].valueChanges.subscribe(() => {
      this.secondFormGroup.controls['confirm_password'].updateValueAndValidity();
    });
  }

  public initFistForm(): void {
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      badgeId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      district: ['', Validators.required],
      branchOffice: [{value: '', disabled: true}, Validators.required],
      mail: ['', [Validators.required, Validators.email]]
    });
  }

  public initSecondForm(): void {
    this.secondFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      confirm_password: ['', [Validators.required, this.matchValues('password')]]
    });
  }

  public getControl(form: FormGroup, value: string): AbstractControl {
    return form.controls[value];
  }

  public onChangeDistrict(districtId: number): void {
    this.branchOfficeService
      .getBranchOffices(districtId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: BranchOffice[]) => {
        this.branchOffices = response;
        this.firstFormGroup.controls['branchOffice'].enable();
      });
  }

  public saveUserForm(): void {
    this.registerModel.setFirstForm(
      this.firstFormGroup.controls['name'].value,
      this.firstFormGroup.controls['lastName'].value,
      this.firstFormGroup.controls['badgeId'].value,
      this.firstFormGroup.controls['branchOffice'].value,
      this.firstFormGroup.controls['mail'].value
    )

    this.stepper.next();
  }

  public register(): void {
    this.authService.setLoading(true);
    this.registerModel.setSecondForm(
      this.secondFormGroup.controls['password'].value,
      this.secondFormGroup.controls['confirm_password'].value
    );

    this.authService
      .register(this.registerModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.result.success(this.registerModel.email);
      }, error => {
        this.result.failed(error.error);
      })
      .add(() => {
        this.authService.setLoading(false);
        this.stepper.next();
        this.stepper.steps.forEach(step => step.editable = false);
      });
  }

  public matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
}
}
