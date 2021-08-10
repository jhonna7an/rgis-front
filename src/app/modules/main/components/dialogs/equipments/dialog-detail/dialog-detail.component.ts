import { ETabDetail } from './../../../body/detail/ETabDetail';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { HistoricService } from '../../../../services/historic.service';
import { HistoricEquipment } from '../../../../models/equipments/historicEquipment';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../services/user.service';
import { UserView } from 'src/app/modules/main/models/manager/userView';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent extends BaseComponent implements OnInit {

  public displayedColumns: string[] = ['date', 'user'];
  public dataSource: MatTableDataSource<HistoricEquipment>;

  public loading: boolean;
  public showHistoricDetail: boolean;
  public historicMessage: string;

  public isDetailTab: boolean;
  public isHistoricTab: boolean;

  public historics: HistoricEquipment[];
  public historic: HistoricEquipment;
  public user: UserView;

  constructor(
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private historicService: HistoricService,
    private userService: UserService
  ) {
    super();
    console.log(data);
  }

  ngOnInit(): void {
    this.showHistoricDetail = false;
    this.isDetailTab = true;
    this.isHistoricTab = false,
    this.historicMessage = 'Elija un registro histórico';
    this.loading = false;

    if (this.data.historicInfo.isHistoricTab) {
      this.userService.Get(this.data.equipment.modificationUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: UserView) => {
          this.user = response;
        }, error => {
          console.error(error);
        });
    }
  }

  public getHistoric = (event: any): void => {
    if (event.index === ETabDetail.DETAIL){
      this.isDetailTab = true;
      this.isHistoricTab = false;
      this.showHistoricDetail = false;
    }

    if (event.index === ETabDetail.HISTORIC) {
      this.isDetailTab = false;
      this.isHistoricTab = true;
      this.loading = true;
      if (this.data.historicInfo.isHistoricTab) {
        this.historicService.getHistoricsByDate(this.data.equipment.id, this.data.historicInfo.search, this.data.historicInfo.from, this.data.historicInfo.to)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: HistoricEquipment[]) => {
            this.handleHistoricEquipments(response);
          }, error => {
            console.log(error);
          });
      } else {
        this.historicService.GetByEquipmentId(this.data.equipment.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: HistoricEquipment[]) => {
            this.handleHistoricEquipments(response);
          }, error => {
            console.log(error);
          });
      }
    }
  }

  private handleHistoricEquipments(historics: HistoricEquipment[]){
    this.historics = historics;
    this.dataSource = new MatTableDataSource(historics);
    if (historics.length == 0) this.historicMessage = 'No existen datos históricos.';
    this.loading = false;
  }

  public getHistoricById = (historic: HistoricEquipment): void => {
    this.historic = historic;
    this.showHistoricDetail = true;
  }

  public close = (): void => {
    this.dialogRef.close();
  }

  public editDialog = (equipment: Equipment): void => {
    this.close();
    const equipments = new Array<Equipment>();
    equipments.push(equipment);
    this.dialog.open(DialogEditComponent,
      { width: '35%', data: { equipments, isMultiEdit: false }});
  }
}
