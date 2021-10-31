import { BaseComponent } from 'src/app/modules/core/components/base/base.component';
import { startWith, takeUntil, map } from 'rxjs/operators';
import { ClientService } from './../../../../../services/client.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/modules/main/models/equipments/client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fault-create',
  templateUrl: './fault-create.component.html',
  styleUrls: ['./fault-create.component.css']
})
export class FaultCreateComponent extends BaseComponent implements OnInit {

  public faultForm: FormGroup;
  private _clients: Client[];

  public clientFilter: Observable<Client[]>

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.getClients();
    console.log('clients')
    console.log(this._clients);
     
    // this._clientFilterApply();
  }

  private createForm(): void {
    this.faultForm = this.formBuilder.group({
      date: ['', Validators.required],
      client: ['', Validators.required],
      store: ['', Validators.required],
      faultDetail: ['', Validators.required],
      faultSheet: ['', Validators.required],
      responsible: ['', Validators.required],
      leader: ['', Validators.required],
      supervisor: ['', Validators.required],
      manager: ['', Validators.required],
    });
  }

  private _filterByClient(value: string): Client[] {
    const formatValue = value.toLocaleLowerCase();

    return this._clients.filter(client => client.clientName.toLocaleLowerCase().indexOf(formatValue) === 0);
  }

  public save(value: any): void {

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

  public getName(clientId: number): string {
    return this._clients.find(client => client.id === clientId).clientName;
  }

  public displayName(client: Client): string {
    return client ? client.clientName : null;
  }
}
