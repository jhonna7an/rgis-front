import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { EquipmentAssignmentService } from '../../../../../services/equipment-assignment.service';
import { EquipmentAssignmentTypeService } from '../../../../../services/equipment-assignment-type.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { EquipmentAssignment } from 'src/app/modules/main/models/equipments/equipment-assignment.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detail-assignment',
  templateUrl: './detail-assignment.component.html',
  styleUrls: ['./detail-assignment.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetailAssignmentComponent extends BaseComponent implements OnInit{

  public assignments: EquipmentAssignment[];
  public dataSource: MatTableDataSource<EquipmentAssignment> = new MatTableDataSource();
  public columnsToDisplay = ['starDate', 'endDate', 'type', 'client', 'employee', 'location', 'state', 'action'];
  public expandedElement: EquipmentAssignment | null;

  @Input()
  private set equipmentId(value: number){
    if (value) {
      this.getAssignments(value);
    }
  }

  constructor(
    private assignmentService: EquipmentAssignmentService,
    private assignmentTypeService: EquipmentAssignmentTypeService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  private getAssignments(equipmentId: number): void{
    this.assignmentService
      .getAssignments(equipmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentAssignment[]) => {
        if (response) {
          this.assignments = response;
          this.dataSource.data = response;
        }
      });
  }

  public closeAssignment(): void{

  }
}
