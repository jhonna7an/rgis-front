import { Component, Input, OnInit } from '@angular/core';
import { ActionResult } from '../../models/action-result.model';

@Component({
  selector: 'app-action-result',
  templateUrl: './action-result.component.html',
  styleUrls: ['./action-result.component.css']
})
export class ActionResultComponent implements OnInit {

  private _result: ActionResult;

  @Input()
  public set result(value: ActionResult){
    console.log(value);
    this._result = value;
  }

  public get result(): ActionResult {
    return this._result;
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.result);
  }

}
