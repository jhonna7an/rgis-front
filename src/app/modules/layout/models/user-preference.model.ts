export class UserPreference {
  user: string;
  preferences: Array<Preference>;

  constructor(user: string) {
    this.preferences = new Array<Preference>();
    this.user = user;
  }

  public setPreference(name: string, value: string): void {
    const preference = this.preferences.find(x => x.name.toLowerCase() === name.toLowerCase());
    if (preference) {
      preference.value = value;
    } else {
      this.preferences.push(new Preference(name, value));
    }
  }
}

export class Preference {
  public name: string;
  public value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

}


