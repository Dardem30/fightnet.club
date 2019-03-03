import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  findUserByEmail(email: string): Observable<User> {
    return this.http.get('https://fightnet.herokuapp.com/user/findUser?email=' + email)
      .map((response: User) => response);
  }
}
