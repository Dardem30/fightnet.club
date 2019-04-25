import {Component} from '@angular/core';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public static user: User;
  public static invite;
  public static fighter2Email;
  public static apiEndpoint = 'https://fightnet.herokuapp.com/';
  //public static apiEndpoint = 'http://localhost:8080/';
}
