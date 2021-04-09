import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailComponent } from '../../../dialogs/equipments/dialog-detail/dialog-detail.component';
import { EquipmentHistoricService } from '../../../../services/equipment-historic.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../shared/helpers/date-adapter';
import { DialogHistoricComponent } from '../../../dialogs/historics/dialog-historic/dialog-historic.component';
import { DataService } from '../../../../services/data.service';
import { Subscription } from 'rxjs';
import { FilterSend, HistoricDataSend, MultiEditData } from '../../../../models/pages/equipment-detail';
import { DialogEditComponent } from '../../../dialogs/equipments/dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ContentComponent implements OnInit, OnDestroy {

  public equipments: Equipment[];
  public historics: Equipment[];
  public loading: boolean;
  public isEmptyHistoric: boolean;

  public showMultiEditCol: boolean;
  public isMultiEditEvent: boolean;

  private equipmentSubscription: Subscription;
  private historicsSubscription: Subscription;

  public serialForm: FormGroup;
  public historicForm: FormGroup;

  public isDetailTab: boolean;
  public isHistoricTab: boolean;

  public historicSearch: string;
  public historicFrom: string;
  public historicTo: string;

  @Output() public sendIsHistoricTab = new EventEmitter<boolean>();

  constructor( public dialog: MatDialog,
               private formBuilder: FormBuilder,
               private historicService: EquipmentHistoricService,
               private dataService: DataService ) {
    this.loading = true;
    this.isEmptyHistoric = true;
    this.showMultiEditCol = false;
    this.isMultiEditEvent = false;
  }

  ngOnInit(): void {
    this.createSerialForm();
    this.createHistoricForm();

    this.equipmentSubscription = this.dataService.equipment$
      .subscribe((equipments: Equipment[]) => {
        this.loading = true;
        this.equipments = equipments;
        setTimeout(() => this.loading = false, 500);
      });

    this.historicsSubscription = this.dataService.hitorics$
      .subscribe((data: HistoricDataSend) => {
        this.loading = true;
        this.historics = data.historics;
        setTimeout(() => this.loading = false, 500);
      });

    this.dataService.multiEditEquipments$
      .subscribe((data: MultiEditData) => {
        if (data.multiEditEquipments) {
          this.showMultiEditCol = data.isMultiEditEvent;
          this.openMultiEditDialog(data.multiEditEquipments);
        }
      });
  }

  public changeTab = (event: any): void => {
    if (event.index === 0) {
      this.loading = true;
      this.isDetailTab = true;
      this.isHistoricTab = false;
      this.isEmptyHistoric = false;
      this.createSerialForm();
    }

    if (event.index === 1) {
      this.isDetailTab = false;
      this.isHistoricTab = true;
      this.isEmptyHistoric = true;
      this.createHistoricForm();
    }

    this.sendIsHistoricTab.emit(this.isHistoricTab);
  }

  ngOnDestroy(): void {
    this.equipmentSubscription.unsubscribe();
    this.historicsSubscription.unsubscribe();
  }

  public searchBySerial = (value: any): void => {
    if (this.serialForm.valid){
      this.serialForm.controls.serial.setValue('');
      const filterData = new FilterSend(true, value.serial);
      this.dataService.filter$.emit(filterData);

      const filterBySerial = this.equipments.filter(x => x.serial.toString() === value.serial);
      this.dataService.equipment$.emit(filterBySerial);
    }
  }

  public searchHistorics = (value: any): void => {
    this.loading = true;
    this.historicSearch = new DatePipe('en-US').transform(value.dateSearch, 'MM/dd/yyyy');
    this.historicFrom = new DatePipe('en-US').transform(value.dateFrom, 'MM/dd/yyyy');
    this.historicTo = new DatePipe('en-US').transform(value.dateTo, 'MM/dd/yyyy');

    this.historicService.getEquipmentByDate(1, this.historicSearch, this.historicFrom, this.historicTo)
      .subscribe((response: Equipment[]) => {
        if (response) {
          this.loading = false;
          this.isEmptyHistoric = false;
          const historicData = new HistoricDataSend(response, true);
          this.dataService.hitorics$.emit(historicData);
        }
      }, error => {
        console.error(error);
      });
  }

  public openDetailDialog(equipment: Equipment): void {
    const historicInfo = {isHistoricTab: this.isHistoricTab,
                          search: this.historicSearch,
                          from: this.historicFrom,
                          to: this.historicTo};
    const dialogRef = this.dialog.open(DialogDetailComponent,
      { width: '80%', height: '560px', data: {equipment, historicInfo} });
  }

  public openDialogHistoricMatched = (): void => {
    const dialogRef = this.dialog.open(DialogHistoricComponent,
      { width: '80%', maxHeight: '560px', data: {
        search: this.historicSearch,
        from: this.historicFrom,
        to: this.historicTo
      }});
  }

  // MULTI EDIT
  public showAndHideMultiEdit(): void {
    this.showMultiEditCol = !this.showMultiEditCol;
    const multiEditData = new MultiEditData(this.showMultiEditCol, false, null);
    this.dataService.multiEditEquipments$.emit(multiEditData);
  }

  public getMultiEditData(): void {
    this.isMultiEditEvent = true;
    const multiEditData = new MultiEditData(this.showMultiEditCol, this.isMultiEditEvent, null);
    this.dataService.multiEditEquipments$.emit(multiEditData);
  }

  public openMultiEditDialog(equipments: Equipment[]): void {
    console.log(equipments);
    const editDialogRef = this.dialog.open(DialogEditComponent,
      { width: '35%', data: { equipments, isMultiEdit: true }});
  }
  // END MULTI EDIT

  private createHistoricForm(): void{
    this.historicForm = this.formBuilder.group({
      dateFrom: [''],
      dateTo: [''],
      dateSearch: ['']
    }, {validator: this.validateDatesEmpty('dateFrom', 'dateTo', 'dateSearch')});
  }

  private createSerialForm(): void{
    this.serialForm = this.formBuilder.group({
      serial: ['', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(10)
      ])]
    });
  }

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

  public validateDatesEmpty(from: string, to: string, search: string): {} {
    return (group: FormGroup): {[key: string]: any} => {
      const fromControl = group.controls[from];
      const toControl = group.controls[to];
      const searchControl = group.controls[search];

      if (!searchControl.value && (!toControl.value || !fromControl.value)){
        return {
          error: 'Es necesario un valor para los campos.'
        };
      }
      return {};
    };
  }
}
