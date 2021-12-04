import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { MultiChoiceData } from 'src/app/modules/main/components/dialogs/equipments/dialog-multi-choice/multiChoiceData';
import { EquipmentService } from 'src/app/modules/main/services/equipment.service';

@Component({
  selector: 'app-dialog-multi-choice',
  templateUrl: './dialog-multi-choice.component.html',
  styleUrls: ['./dialog-multi-choice.component.css']
})
export class DialogMultiChoiceComponent implements OnInit {

  public equipments: Equipment[];
  public dataSource: MatTableDataSource<Equipment> = new MatTableDataSource();
  public types: string[];

  public restartBtnDisabled: boolean;
  public editBtnDisabled: boolean;

  public multiChoices: MultiChoiceData[];
  public hasData: boolean;
  public displayedColumns: string[] = ['type','serial','status','action']

  constructor(
    private equipmentService: EquipmentService,
    @Inject(MAT_DIALOG_DATA) public data: Equipment[]
  ) {
    this.restartBtnDisabled = true;
    this.hasData = data.length > 0 ? true : false;
    this.equipments = data;
    this.setEquipments(data);

    const types = data.map(x => x.type).filter((quantity,index,self) => self.indexOf(quantity) === index);
    this.types = types;
    this.editBtnDisabled = types.length > 1 ? true : false;
  }

  ngOnInit(): void {
  }

  public filterApply(type: string): void {
    const filter = this.dataSource.data.filter(x => x.type === type);
    this.types = this.types.filter(x => x === type);
    this.setEquipments(filter);
    this.restartBtnDisabled = false;
    this.editBtnDisabled = false;
  }

  public restartFilter(): void{
    this.setEquipments(this.equipments)
    this.types = this.equipments.map(x => x.type).filter((quantity,index,self) => self.indexOf(quantity) === index);
    this.restartBtnDisabled = true;
    this.editBtnDisabled = true;
  }

  public remove(equipment: Equipment): void{
    this.equipments = this.equipments.filter((value, _index, _array) => {
      return value.id != equipment.id;
    });

    this.types = this.equipments.map(x => x.type).filter((quantity,index,self) => self.indexOf(quantity) === index);
    this.setEquipments(this.equipments);

    if (this.equipments.length <= 0) {
      this.hasData = false;
    }

    this.equipmentService.setMultiChoiceEquipments(this.equipments);
  }

  public edit(): void {
    console.log(this.dataSource.data);

  }

  private setEquipments(equipments: Equipment[]): void{
    this.dataSource.data = equipments;
  }

  private editGroup(event): void{
    event.stopPropagation();
  }
}
