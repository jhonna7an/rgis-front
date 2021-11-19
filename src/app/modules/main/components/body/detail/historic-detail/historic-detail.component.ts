import { FormBuilder, FormGroup } from '@angular/forms';
import { HistoricService } from './../../../../services/historic.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogHistoricComponent } from '../../../dialogs/historics/dialog-historic/dialog-historic.component';
import { takeUntil } from 'rxjs/operators';
import { DetailData, EquipmentData } from 'src/app/modules/main/models/detailData.model';
import { Historic } from 'src/app/modules/main/models/equipments/historicEquipment';
import { DetailService } from 'src/app/modules/main/services/workflow/detail.service';

@Component({
  selector: 'app-historic-detail',
  templateUrl: './historic-detail.component.html',
  styleUrls: ['./historic-detail.component.css']
})
export class HistoricDetailComponent extends BaseComponent implements OnInit {

  public historicForm: FormGroup;
  public detailData: DetailData;
  public equipmentData : EquipmentData;

  public historics: Historic[];

  public isEmptyHistoric: boolean;
  public isLoading: boolean;

  constructor(
    private detailService: DetailService,
    private historicService: HistoricService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    super();
    this.equipmentData = new EquipmentData();
  }

  ngOnInit(): void {
    this.isEmptyHistoric = true;
    this.createHistoricForm();

    this.historicForm.statusChanges
    .subscribe(status => {
      console.log(status);
      console.log(this.historicForm);

    })

    // Subscribe to Tab Main Changes
    this.detailService.getDetailData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DetailData) => {
        if (response) {
          this.detailData = response;
          if (response.isMainHistoricTab) {
            this.equipmentData.setEventFromBody(this.historics);
            this.detailService.setEquipments(this.equipmentData);
          }
        }
      });

    // Get Equipments from Subject
    this.detailService.getEquipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentData) => {
        if (response && response.isSidebarEvent && response.isHistoricTab) {
          this.historics = response.equipments as Historic[];
        }
      });
  }

  public searchHistorics(value: any): void {
    this.isLoading = true;
    this.detailService.setLoading(true);
    const search = new DatePipe('en-US').transform(value.dateSearch, 'MM/dd/yyyy');
    const from = new DatePipe('en-US').transform(value.dateFrom, 'MM/dd/yyyy');
    const to = new DatePipe('en-US').transform(value.dateTo, 'MM/dd/yyyy');

    this.historicService.getByDate(1, search, from, to)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Historic[]) => {
        if (response) {
          this.isLoading = false;
          this.isEmptyHistoric = false;
          this.historics = response;

          if (search) {
            this.detailData.setHistoricSearch(search);
          } else if (from && to) {
            this.detailData.setHistoricRange(from, to);
          }

          this.historicForm.reset();
          this.equipmentData.setEventFromBody(response);
          this.detailService.setEquipments(this.equipmentData);
        }
      }, error => {
        console.error(error);
      });
  }

  private createHistoricForm(): void {
    this.historicForm = this.formBuilder.group({
      dateFrom: [''],
      dateTo: [''],
      dateSearch: ['']
    }, { validator: this.validateDatesEmpty('dateFrom', 'dateTo', 'dateSearch') });
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

  public openDialogHistoricMatched(): void {
    this.dialog.open(DialogHistoricComponent,
      { width: '80%',
        maxHeight: '560px',
        data: this.detailData.historicData
      });
  }
}
