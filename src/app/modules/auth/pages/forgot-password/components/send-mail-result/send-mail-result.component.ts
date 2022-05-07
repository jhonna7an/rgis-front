import { Component, Input, OnInit } from '@angular/core';

import { SendMailResult } from '../../models/send-mail-result.model';

@Component({
  selector: 'app-send-mail-result',
  templateUrl: './send-mail-result.component.html',
  styleUrls: ['./send-mail-result.component.css']
})
export class SendMailResultComponent implements OnInit {

  @Input() public result: SendMailResult;

  constructor() { }

  ngOnInit(): void {
  }

}
