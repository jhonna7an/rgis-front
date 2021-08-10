import { ToastService } from './../../../shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../models/equipments/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { DataService } from '../../services/data.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css']
})
export class EquipmentDetailComponent extends BaseComponent implements OnInit {

  public hasFilter: boolean;
  public hasTypeFilter: boolean;
  public equipments: Equipment[];
  public serialFilter: string;
  public loading: boolean;

  public isHistoricTab: boolean;

  constructor(
    private equipmentService: EquipmentService,
    private toastService: ToastService,
    private dataService: DataService
  ) {
    super();
    this.loading = false;
    this.hasFilter = false;
    this.hasTypeFilter = false;
    this.serialFilter = '';
    this.isHistoricTab = false;
  }

  ngOnInit(): void {
    this.GetEquipments();

    this.equipmentService.edited$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag: boolean) => {
        this.GetEquipments();
        this.toastService.showSuccess('Se completó la solicitud correctamente');
      });

    this.dataService.restart$
      .subscribe((value: boolean) => {
        if (!this.isHistoricTab) {
          this.GetEquipments();
        }
      });
  }

  public GetEquipments(): void {
    this.equipmentService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Equipment[]) => {
        console.log(response);

        this.equipments = response;
        this.equipmentService.setEquipments(response);
        // this.dataService.equipment$.emit(response);
      });
  }

  public getSerial(serial: string): void{
    this.equipments = this.equipments.filter(x => x.serial === serial);
    this.hasFilter = true;
    this.serialFilter = serial;
  }

  public getIsHistoricTab(value: boolean): void{
    this.isHistoricTab = value;
    if (!value) {
      this.GetEquipments();
    }
  }

  // private openSnackBar = (flag: boolean) => {
  //   const class_style = flag ? 'snackBar-success' : 'snackBar-error';
  //   const message = flag ? 'Se completo la solicitud correctamente' : 'Se produjo un error al intentar procesar la solicitud';
  //   this.snackBar.open(message, '', {
  //     duration: 5000,
  //     horizontalPosition: 'right',
  //     verticalPosition: 'top',
  //     panelClass: [class_style]
  //   });s
  // }
}
