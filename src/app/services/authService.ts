import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';

@Injectable()
export class AuthService {

  constructor(private http: Http, private router: Router) {

  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(AppComponent.apiEndpoint + 'security/login', {'email': email, 'password': password})
      .map((response: Response) => {
        let token = response.headers.get('Authorization');
        if (token) {
          localStorage.setItem('currentUser', token);
          localStorage.setItem('email', email);
          return true;
        } else {
          return false;
        }
      });
  }

  registration(username: string, code: string) {
    this.http.post(AppComponent.apiEndpoint + 'security/sign-up?email=' + username + '&code=' + code, {})
      .subscribe(res=> {
        if (res.text() == 'false') {
          alert('Wrong code')
        } else {
          this.router.navigate(['']);
        }
      });
  }
  sendCode(model: any) {
    model.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.http.post(AppComponent.apiEndpoint + 'security/sendCode', model)
      .subscribe(res => {
        if (res.text() == 'false') {
          alert('Sorry but user with this email already exists')
        } else {
          this.router.navigate(['confirmCode', model.email]);
        }
      });
  }
}
