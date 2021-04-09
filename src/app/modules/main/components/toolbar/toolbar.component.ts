import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public badgeId: string;
  public notificationCount: number;

  constructor() { }

  ngOnInit(): void {
    this.badgeId = '66900038';
    this.notificationCount = 3;
  }

}
