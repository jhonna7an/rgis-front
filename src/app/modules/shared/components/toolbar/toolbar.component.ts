import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public badgeId: string;
  public notificationCount: number;

  constructor(
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(this.applicationService.getByKey('user'));
    this.badgeId = user.badgeId;
    this.notificationCount = 3;
  }

  public logout(): void {
    this.applicationService.logout();
  }
}
