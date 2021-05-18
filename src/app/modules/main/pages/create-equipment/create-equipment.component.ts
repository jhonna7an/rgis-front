import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.css']
})
export class CreateEquipmentComponent implements OnInit {

  public createForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initCreateForm();
  }

  get fm(){
    return this.createForm.controls;
  }

  private initCreateForm(){
    this.createForm = this.formBuilder.group(
      {
        serial: ['', Validators.compose(
          [
            Validators.required,
            Validators.pattern(/^[0-9]*$/)
          ]
        )],
        serialFactory: [''],
        marca: ['', Validators.required],
        model: ['', Validators.required],
        creationDate: ['', Validators],
        InServices: ['', Validators.required],
        creationUser: ['', Validators.required],
        district: ['', Validators.required],
        branchOffice: ['', Validators.required]
      }
    );
  }

  public saveEquipment(value: any){
    console.log(value);

  }
}
