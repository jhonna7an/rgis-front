import { Component, Input, OnInit } from '@angular/core';
import { RegisterResult } from '../../models/register-result.model';

@Component({
  selector: 'app-register-message',
  templateUrl: './register-message.component.html',
  styleUrls: ['./register-message.component.css']
})
export class RegisterMessageComponent implements OnInit {

  @Input() public result: RegisterResult;

  constructor() { }

  ngOnInit(): void {
  }

}
