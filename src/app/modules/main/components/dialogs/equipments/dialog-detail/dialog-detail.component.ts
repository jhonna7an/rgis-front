import { EquipmentFault } from './../../../../models/equipments/equipment-fault.model';
import { EquipmentFaultService } from './../../../../services/equipment-fault.service';
import { ToastService } from './../../../../../shared/services/toast.service';
import { EquipmentAbm } from './../../../../models/equipments/equipment';
import { CommentService } from './../../../../services/comment.service';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';
import { SidenavService } from './../../../../../shared/services/sidenav.service';
import { DetailData, EditOneData } from './../../../../models/detailData.model';
import { ETabDetail } from './../../../body/detail/ETabDetail';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { EEquipmentState } from 'src/app/modules/main/models/EEquipmentState';

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
  public showFaultAlert: boolean;

  public sidenavMessage: string;
  public isEditBtnDisabled: boolean;

  public titleEditOrFault: string;
  public holdButtonName: string;

  public isFaultButtonDisabled: boolean;
  public isEditSaveChangesDisabled: boolean;

  constructor(
    private equipmentService: EquipmentService,
    private commentService: CommentService,
    public equipmentFaultService: EquipmentFaultService,
    private sidenavService: SidenavService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailData,
    public dialog: MatDialog
  ) {
    super();
    console.log(data);

    this.equipmentCurrent = data.equipment;
    this.detailData = data;
    this.detailData.setIsEditModule(false);
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.isEditModule = false;
    this.isFaultCreate = false;
    this.showFaultAlert = false;
    this.isDetailTab = true;
    this.isHistoricTab = false;
    this.sidenavMessage = 'Cerrar lista de históricos';
    this.isEditBtnDisabled = true;

  // Get Equipments from Edit Module to Save
  this.equipmentService
    .getEditEndEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: boolean) => {
      if (response) {
        this.isLoading = false;
        this.equipmentService.triggerRestartEquipments();
        this.toastService.showSuccess('Se guardaron los cambios correctamente');
      } else {
        this.toastService.showError('Se produjo un error al intentar guardar los cambios');
      }
    });

  this.equipmentService
    .getEquipmentToEdit()
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: EquipmentAbm) => {
      if (response) {
        this.isLoading = true;
        this.equipmentService.edit(response)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: boolean) => {
            this.isLoading = false;
            if (data) {
              this.equipmentService.triggerRestartEquipments();
              this.toastService.showSuccess('Se guardaron los cambios correctamente');

              if (response.stateId === EEquipmentState.Averia &&
                  this.equipmentCurrent.stateId !== EEquipmentState.Averia) {
                this.isFaultCreate = true;
                this.titleEditOrFault = 'Avería';
                this.dialogRef.disableClose = true;
              } else {
                this.close();
              }
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
    this.commentService
      .commentsLoadedEvent()
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

    // Fault Button Disabled Handler
    this.equipmentFaultService
      .getIsDisabled()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.isFaultButtonDisabled = value;
      });

    // Edit Save Changes Disabled Handler
    this.equipmentService
      .getIsSubmitBtnDisable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        console.log('Padre:' + value);

        this.isEditSaveChangesDisabled = value;
      });

    // Fault Save End Event
    this.equipmentFaultService
      .getCreateEndEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.dialogRef.close();
          this.toastService.showSuccess('Se guardó el nuevo registro correctamente');
        }
        else {
          this.toastService.showError('Se produjo un error al intentar guardar la información');
        }
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
    if (this.isFaultCreate) {
      this.showFaultAlert = true;
      return;
    }

    this.dialogRef.close();
  }

  public editDialog(): void {
    this.isEditModule = true;
    this.isFaultCreate = false;
    this.titleEditOrFault = 'Editar';
    this.holdButtonName = this.equipmentCurrent.isHold ? 'Quitar de hold' : 'Poner en hold';

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
    this.isLoading = true;
    this.isFaultCreate = false;
    const editOneData = new EditOneData(false);
    this.equipmentService.setEditSaveEvent(editOneData);
  }

  public holdHandler(): void {
    this.isLoading = true;
    this.isFaultCreate = false;
    const editOneData = new EditOneData(true);
    if (this.equipmentCurrent.isHold) {
      editOneData.setRemoveToHold()
    } else {
      editOneData.setAddToHold();
    }
    this.equipmentService.setEditSaveEvent(editOneData);
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

  public saveFault(): void {
    this.showFaultAlert = false;
    this.equipmentFaultService.setSaveCreateEvent();
  }
}
