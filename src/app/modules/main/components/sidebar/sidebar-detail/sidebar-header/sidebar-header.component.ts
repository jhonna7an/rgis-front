import { EquipmentData } from 'src/app/modules/main/models/detailData.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { DetailData } from './../../../../models/detailData.model';
import { DetailService } from './../../../../services/workflow/detail.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.css']
})
export class SidebarHeaderComponent extends BaseComponent implements OnInit {

  public detailData: DetailData;
  public serialForm: FormGroup;

  @Output() serialSearch = new EventEmitter<{}>();
  @Output() restartEvent = new EventEmitter<void>();

  public breadcrumbs: string[];
  public currentBreadcrumbs: string[];
  public historicBreadcrumbs: string[];

  @Input()
  set filter(value: string){
    if (value) {
      if (!this.detailData.isMainHistoricTab) {
        this.currentBreadcrumbs.push(value);
      } else {
        this.historicBreadcrumbs.push(value);
      }
    }
  }

  constructor(
    private detailService: DetailService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.breadcrumbs = new Array<string>();
    this.currentBreadcrumbs = new Array<string>();
    this.historicBreadcrumbs = new Array<string>();
   }

  ngOnInit(): void {
    this.createSerialForm();

    this.detailService.getDetailData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DetailData) => {
        if (response) {
          this.detailData = response;
          if (!response.isMainHistoricTab) {
            this.breadcrumbs = this.currentBreadcrumbs;
          } else {
            this.breadcrumbs = this.historicBreadcrumbs;
          }
        }
      });

    this.detailService.getEquipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentData) => {
        if (response) {
          if (this.detailData.isMainHistoricTab && response.isBodyEvent && response.equipments) {
            this.serialForm.get('serial').enable();
          }
        }
      });
  }

  private createSerialForm(): void{
    this.serialForm = this.formBuilder.group({
      serial: [
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
      ],
    });
  }

  public searchBySerial(value: any){
    this.serialForm.reset();
    if (this.detailData.isMainHistoricTab) {
      this.historicBreadcrumbs.push(value.serial)
    }
    this.serialSearch.emit(value);
  }

  public restartFilters(): void{
    if (!this.detailData.isMainHistoricTab) {
      this.currentBreadcrumbs.splice(0, this.currentBreadcrumbs.length);
      this.breadcrumbs = this.currentBreadcrumbs;
    } else {
      this.historicBreadcrumbs.splice(0, this.historicBreadcrumbs.length);
      this.breadcrumbs = this.historicBreadcrumbs;
    }

    this.restartEvent.emit();
  }
}
