import { Component, OnDestroy, OnInit, Predicate } from '@angular/core';
import { Equipment } from '../../models/equipments/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css']
})
export class EquipmentDetailComponent implements OnInit, OnDestroy {

  public hasFilter: boolean;
  public hasTypeFilter: boolean;
  public equipments: Equipment[];
  public serialFilter: string;
  public loading: boolean;

  public isHistoricTab: boolean;
  private editedSuscription: Subscription;
  private equipmentSubscription: Subscription;

  constructor(private equipmentService: EquipmentService,
              private snackBar: MatSnackBar,
              private dataService: DataService) {
    this.loading = false;
    this.hasFilter = false;
    this.hasTypeFilter = false;
    this.serialFilter = '';
    this.isHistoricTab = false;
  }

  ngOnInit(): void {
    this.GetEquipments();

    this.editedSuscription = this.equipmentService.edited$
      .subscribe((flag: boolean) => {
        this.GetEquipments();
        this.openSnackBar(flag);
      });

    this.dataService.restart$
      .subscribe((value: boolean) => {
        if (!this.isHistoricTab) {
          this.GetEquipments();
        }
      });
  }

  ngOnDestroy(): void {
    this.editedSuscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

  public GetEquipments(): void {
    const equipment$ = this.equipmentService.Get()
      .subscribe((response: Equipment[]) => {
        this.equipments = response;
        this.dataService.equipment$.emit(response);
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

  private openSnackBar = (flag: boolean) => {
    const class_style = flag ? 'snackBar-success' : 'snackBar-error';
    const message = flag ? 'Se completo la solicitud correctamente' : 'Se produjo un error al intentar procesar la solicitud';
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [class_style]
    });
  }
}
