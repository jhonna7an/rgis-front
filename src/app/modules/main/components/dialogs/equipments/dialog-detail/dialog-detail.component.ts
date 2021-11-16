import { EquipmentFaultService } from './../../../../services/equipment-fault.service';
import { ToastService } from './../../../../../shared/services/toast.service';
import { EquipmentAbm } from './../../../../models/equipments/equipment';
import { CommentService } from './../../../../services/comment.service';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { SidenavService } from './../../../../../shared/services/sidenav.service';
import { DetailData } from './../../../../models/detailData.model';
import { ETabDetail } from './../../../body/detail/ETabDetail';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent extends BaseComponent implements OnInit {

  public detailData: DetailData;
  public equipmentCurrent: Equipment;

  public isLoading: boolean;
  public isDetailTab: boolean;
  public isHistoricTab: boolean;
  public isEditModule: boolean;
  public isFaultCreate: boolean;

  public sidenavMessage: string;
  public isEditBtnDisabled: boolean;

  public titleEditOrFault: string;

  constructor(
    private equipmentService: EquipmentService,
    private commentService: CommentService,
    private equipmentFaultService: EquipmentFaultService,
    private sidenavService: SidenavService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailData,
    public dialog: MatDialog
  ) {
    super();
    this.equipmentCurrent = data.equipment;
    this.detailData = data;
    this.detailData.setIsEditModule(false);
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.isEditModule = false;
    this.isFaultCreate = false;
    this.isDetailTab = true;
    this.isHistoricTab = false;
    this.sidenavMessage = 'Cerrar lista de históricos';
    this.isEditBtnDisabled = true;

    // Get Equipments from Edit Module to Save
    this.equipmentService
      .getEquipmentToEdit()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentAbm) => {
        if (response) {
          this.isLoading = true;
          this.isEditModule = false;
          this.isFaultCreate = false;
          this.equipmentService.edit(response)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: boolean) => {
              this.isLoading = false;
              this.close();
              if (data) {
                this.equipmentService.triggerRestartEquipments();
                this.toastService.showSuccess('Se guardaron los cambios correctamente');
              } else {
                this.toastService.showError('Se produjo un error al intentar guardar los cambios');
              }
            }, error => {
              this.toastService.showError('Se produjo un error al intentar guardar los cambios');
              console.error(error);
            });
        }
      });

    // Manage button Edit disabled
    this.commentService.commentsLoadedEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isEditBtnDisabled = false;
      });

      // Manage Fault Create
      this.equipmentService
        .getFaultCreate()
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: EquipmentAbm) => {
          this.isFaultCreate = true;
          this.titleEditOrFault = 'Avería';
        });
  }

  public getHistoric = (event: any): void => {
    if (event.index === ETabDetail.DETAIL){
      this.isDetailTab = true;
      this.isHistoricTab = false;
      this.detailData.changeDialogTab(this.equipmentCurrent, false);
    }

    if (event.index === ETabDetail.HISTORIC) {
      this.isDetailTab = false;
      this.isHistoricTab = true;
      this.detailData.changeDialogTab(this.equipmentCurrent, true);
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public editDialog(): void {
    this.isEditModule = true;
    this.isFaultCreate = false;
    this.titleEditOrFault = 'Editar';
    const comments = this.commentService
      .getComments()
      .map(x => x.comment);
    this.detailData.setIsEditModule(true);
    this.detailData.setCommentsToEdit(comments);
  }

  public toggleSidenav(): void{
    this.sidenavService.toggle();
    this.sidenavMessage = this.sidenavService.isOpened() ? 'Cerrar lista de históricos' : 'Abrir lista de históricos';
  }

  public saveChanges(): void {
    this.equipmentService.saveEdit();
  }

  public back(): void {
    if (this.isFaultCreate) {
      this.isFaultCreate = false;
      this.titleEditOrFault = 'Editar';
      this.detailData.setIsEditModule(true);
      return;
    }

    this.detailData.setIsEditModule(false);
    this.isEditModule = false;
  }
}
