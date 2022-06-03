import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public badgeId: string;
  public notificationCount: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.badgeId = user.badgeId;
    this.notificationCount = 3;
  }

  public logout(): void {
    this.authService.logout();
  }
}
