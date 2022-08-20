import { Component, OnInit, Renderer2 } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { Preference, UserPreference } from '../../../layout/models/user-preference.model';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public badgeId: string;
  public notificationCount: number;
  public hasDarkTheme: boolean = false;

  constructor(
    private applicationService: ApplicationService,
    private render: Renderer2
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(this.applicationService.getByKey('user'));
    this.badgeId = user.badgeId;
    this.notificationCount = 3;

    this.applicationService
    .getUserPreference()
    .subscribe((response: UserPreference) => {
      if (response) {
        this.handleUserPreference(response);
      }
    });
  }

  public logout(): void {
    this.applicationService.logout();
  }

  public onChangeTheme(event: any): void {
    this.savePreference(event.target.checked);
    this.setDarkTheme(event.target.checked);
  }

  private handleUserPreference(value: UserPreference): void {
    const darkTheme = value.preferences.find(x => x.name.toLowerCase() === 'dark-theme');
    if (darkTheme) {
      this.setDarkTheme(darkTheme.value === 'true');
    }
  }

  private setDarkTheme(value: boolean): void {
    if(value) {
      this.hasDarkTheme = true;
      this.render.setAttribute(document.body, 'data-theme', 'dark');
    } else {
      this.hasDarkTheme = false;
      this.render.removeAttribute(document.body, 'data-theme');
    }
  }

  private savePreference(value: boolean): void {
    const legajo = sessionStorage.getItem('userId');
    if (legajo) {
      const userPreferences = localStorage.getItem('user-preferences');
      if (userPreferences) {
        const user_preferences_obj: Array<UserPreference> = JSON.parse(userPreferences);
        const userMatch = user_preferences_obj.find(x => x.user === legajo);
        if (userMatch) {
          this.setPreference('dark-theme', value.toString(), userMatch);
        } else {
          const preference = new UserPreference(legajo);
          this.setPreference('dark-theme', value.toString(), preference);
          user_preferences_obj.push(preference);
        }
        localStorage.setItem('user-preferences', JSON.stringify(user_preferences_obj));
      } else {
        debugger
        const user_preferences: UserPreference[] = [];
        const preference = new UserPreference(legajo);
        this.setPreference('dark-theme', value.toString(), preference);
        user_preferences.push(preference);
        localStorage.setItem('user-preferences', JSON.stringify(user_preferences))
      }
    }
  }

  public setPreference(name: string, value: string, user_preference: UserPreference): void {
    const preference = user_preference.preferences.find(x => x.name.toLowerCase() === name.toLowerCase());
    if (preference) {
      preference.value = value;
    } else {
      user_preference.preferences.push(new Preference(name, value));
    }
  }
}
