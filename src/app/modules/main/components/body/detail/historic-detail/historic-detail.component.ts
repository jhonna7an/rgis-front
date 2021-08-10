import { TabHandler } from './../TabHandler';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistoricService } from './../../../../services/historic.service';
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { DatePipe } from '@angular/common';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { HistoricDataSend } from 'src/app/modules/main/models/pages/equipment-detail';
import { MatDialog } from '@angular/material/dialog';
import { DialogHistoricComponent } from '../../../dialogs/historics/dialog-historic/dialog-historic.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-historic-detail',
  templateUrl: './historic-detail.component.html',
  styleUrls: ['./historic-detail.component.css']
})
export class HistoricDetailComponent extends BaseComponent implements OnInit {

  public historics: Equipment[];
  public historicForm: FormGroup;
  public historicSearch: string;
  public historicFrom: string;
  public historicTo: string;
  public isEmptyHistoric: boolean;
  public isLoading: boolean;

  @Input() tabHandler: TabHandler;

  constructor(
    private formBuilder: FormBuilder,
    private historicService: HistoricService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.isEmptyHistoric = true;
    this.createHistoricForm();
  }

  public searchHistorics = (value: any): void => {
    // this.loading = true;
    this.historicSearch = new DatePipe('en-US').transform(value.dateSearch, 'MM/dd/yyyy');
    this.historicFrom = new DatePipe('en-US').transform(value.dateFrom, 'MM/dd/yyyy');
    this.historicTo = new DatePipe('en-US').transform(value.dateTo, 'MM/dd/yyyy');

    this.historicService.getByDate(1, this.historicSearch, this.historicFrom, this.historicTo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        if (response) {
          // this.loading = false;
          // this.isEmptyHistoric = false;
          const historicData = new HistoricDataSend(response, true);
          // this.dataService.hitorics$.emit(historicData);
        }
      }, error => {
        console.error(error);
      });
  }

  private createHistoricForm(): void{
    this.historicForm = this.formBuilder.group({
      dateFrom: [''],
      dateTo: [''],
      dateSearch: ['']
    }, {validator: this.validateDatesEmpty('dateFrom', 'dateTo', 'dateSearch')});
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
      { width: '80%', maxHeight: '560px', data: {
        search: this.historicSearch,
        from: this.historicFrom,
        to: this.historicTo
      }});
  }
}
