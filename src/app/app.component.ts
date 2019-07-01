import {Component} from '@angular/core';
import {User} from './models/user';
import {Invite} from './models/invite';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static user: User;
  public static invite: Invite;
  public static isEnglish: boolean = true;
  public static fighter2Email;
  //public static apiEndpoint = 'https://fightnet.herokuapp.com/';
  public static apiEndpoint = 'http://localhost:8080/';
  constructor(private http: HttpClient) {
    this.http.get('http://ip-api.com/json').subscribe((result: {country:string}) => {
      const country = result.country;
      if (country == 'Belarus' || country == 'Russia' || country == 'Ukraine') {
        AppComponent.isEnglish = false;
      }
    })
  }
}
