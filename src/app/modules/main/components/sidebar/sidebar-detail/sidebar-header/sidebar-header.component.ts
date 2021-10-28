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
  }

  private createSerialForm(): void{
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

  public searchBySerial(value: string){
    this.serialForm.reset();
    this.serialSearch.emit(value);
  }

  public restartFilters(): void{
    if (!this.detailData.isMainHistoricTab) {
      this.currentBreadcrumbs = new Array<string>();
    } else {
      this.historicBreadcrumbs = new Array<string>();
    }

    this.breadcrumbs = new Array<string>();

    this.restartEvent.emit();
  }
}
