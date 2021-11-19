import { EquipmentFault } from './../../../../../models/equipments/equipment-fault.model';
import { EquipmentFaultService } from './../../../../../services/equipment-fault.service';
import { EEmployeePosition } from './../../../../../models/EEmployeePosition.enum';
import { EmployeeService } from './../../../../../services/employee.service';
import { Employee } from './../../../../../models/Manager/employee';
import { Equipment } from 'src/app/modules/main/models/equipments/equipment';
import { EquipmentFaultDetail } from './../../../../../models/equipments/equipment-fault-detail';
import { FaultDetailService } from './../../../../../services/fault-detail.service';
import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { startWith, takeUntil, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { ClientService } from './../../../../../services/client.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/modules/main/models/equipments/client';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-fault-create',
  templateUrl: './fault-create.component.html',
  styleUrls: ['./fault-create.component.css']
})
export class FaultCreateComponent extends BaseComponent implements OnInit {

  public faultForm: FormGroup;
  private _equipment: Equipment;
  private _clients: Client[];

  public faultDetails: EquipmentFaultDetail[];
  public responsibles: Employee[];
  public leaders: Employee[];
  public supervisors: Employee[];

  public clientFilter: Observable<Client[]>

  @Input()
  public set equipment(value: Equipment){
    if (value) {
      this._equipment = value;
      this.getFaultDetails(value.typeId);
    }
  }

  public get equipment(): Equipment {
    return this._equipment;
  }

  constructor(
    private equipmentFaultService: EquipmentFaultService,
    private clientService: ClientService,
    private faultDetailService: FaultDetailService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.getClients();
    this._getEmployees();

    this.equipmentFaultService
      .getSaveCreateEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const equipmentFault = new EquipmentFault(this.faultForm.value, this.equipment.id, 1, this._clients);
        console.log(equipmentFault);
        this.equipmentFaultService.create(equipmentFault)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response: boolean) => {
              this.equipmentFaultService.setCreateEndEvent(response);
            },
            error => {
              this.equipmentFaultService.setCreateEndEvent(false);
              console.log(error)
            });
      });

    this.faultForm.statusChanges
      .subscribe(() => {
        this.equipmentFaultService.setIsDisabled(this.faultForm.valid);
      });
  }

  private createForm(): void {
    this.faultForm = this.formBuilder.group({
      date: ['', Validators.required],
      client: ['', Validators.required],
      store: ['', Validators.required],
      detail: ['', Validators.required],
      leader: ['', Validators.required],
      supervisor: ['', Validators.required],
      faultSheet: [''],
    });
  }

  private _filterByClient(value: string): Client[] {
    const formatValue = value.toLocaleLowerCase();

    return this._clients.filter(client => client.clientName.toLocaleLowerCase().indexOf(formatValue) === 0);
  }

  private getClients(): void {
    this.clientService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Client[]) => {
        if (response) {
          this._clients = response;
          this._clientFilterApply();
        }
      });
  }

  private _clientFilterApply(): void {
    this.clientFilter = this.faultForm.get('client').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterByClient(value))
      );
  }

  private getFaultDetails(typeId: number): void {
    this.faultDetailService
      .get(typeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: EquipmentFaultDetail[]) => {
        if (response) {
          this.faultDetails = response;
        }
      });
  }

  private _getEmployees(){
    this.employeeService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Employee[]) => {
        if (response) {
          this.responsibles = response.filter(x => x.employeePositionId === EEmployeePosition.InventoryAssistence ||
                                                   x.employeePositionId === EEmployeePosition.InventoryLeader);
          this.leaders = response.filter(x => x.employeePositionId === EEmployeePosition.InventoryLeader);
          this.supervisors = response.filter(x => x.employeePositionId === EEmployeePosition.Supervisor ||
                                                  x.employeePositionId === EEmployeePosition.AreaManager);
        }
      });
  }

  public getName(clientId: number): string {
    return this._clients.find(client => client.id === clientId).clientName;
  }

  public displayName(client: Client): string {
    return client ? client.clientName : null;
  }
}
