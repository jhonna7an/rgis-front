import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { EquipmentHistoricService } from '../../../../services/equipment-historic.service';
import { HistoricEquipment } from '../../../../models/equipments/historicEquipment';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../services/user.service';
import { UserView } from 'src/app/modules/main/models/manager/userView';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent implements OnInit {

  public showFiller = true;
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

  constructor(public dialogRef: MatDialogRef<DialogDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog, private historicService: EquipmentHistoricService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.showHistoricDetail = false;
    this.isDetailTab = true;
    this.isHistoricTab = false,
    this.historicMessage = 'Elija un registro histórico';
    this.loading = false;

    if (this.data.historicInfo.isHistoricTab) {
      this.userService.Get(this.data.equipment.modificationUserId)
        .subscribe((response: UserView) => {
          this.user = response;
        }, error => {
          console.log(error);
        });
    }
  }

  public getHistoric = (event: any): void => {
    if (event.index === 0){
      this.isDetailTab = true;
      this.isHistoricTab = false;
      this.showHistoricDetail = false;
    }

    if (event.index === 1) {
      this.isDetailTab = false;
      this.isHistoricTab = true;
      this.loading = true;
      if (this.data.historicInfo.isHistoricTab) {
        this.historicService.getHistoricsByDate(this.data.equipment.id, this.data.historicInfo.search, this.data.historicInfo.from, this.data.historicInfo.to)
          .subscribe((response: HistoricEquipment[]) => {
            this.historics = response;
            this.dataSource = new MatTableDataSource(response);
            if (response.length == 0) this.historicMessage = 'No existen datos históricos.';
            this.loading = false;
          }, error => {
            console.log(error);
          });
      } else {
        this.historicService.GetByEquipmentId(this.data.equipment.id)
          .subscribe((response: HistoricEquipment[]) => {
            this.historics = response;
            this.dataSource = new MatTableDataSource(response);
            if (response.length == 0) this.historicMessage = 'No existen datos históricos.';
            this.loading = false;
          }, error => {
            console.log(error);
          });
      }
    }
  }

  public getHistoricById = (historic: HistoricEquipment): void => {
    this.historic = historic;
    this.showHistoricDetail = true;
  }

  public close = (): void => {
    this.dialogRef.close('detail modal');
  }

  public editDialog = (equipment: Equipment): void => {
    this.close();
    const equipments = new Array<Equipment>();
    equipments.push(equipment);
    const editDialogRef = this.dialog.open(DialogEditComponent,
      { width: '35%', data: { equipments, isMultiEdit: false }});
  }
}
