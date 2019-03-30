import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {BookedUser} from '../models/bookedUser';
import {User} from '../models/user';
import {Invite} from '../models/invite';
import {UserNotification} from '../models/notification';

@Injectable()
export class UserService {
  constructor(private http: HttpClient
    , private router: Router) {
  }

  findUserByEmail(email: string): Observable<User> {
    return this.http.get(AppComponent.apiEndpoint + 'util/findUser?email=' + email)
      .map((response: User) => response);
  }

  search(model): Observable<User[]> {
    model.searcherEmail = localStorage.getItem('email');
    return this.http.post(AppComponent.apiEndpoint + 'util/listUsers', model)
      .map((response: User[]) => response);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['']);
  }

  bookPerson(email: any) {
    this.http.get(AppComponent.apiEndpoint + 'util/bookPerson?currentUserEmail=' + localStorage.getItem('email') + '&personEmail=' + email)
      .subscribe();
  }

  getBookedPersons(): Observable<BookedUser[]> {
    return this.http.get(AppComponent.apiEndpoint + 'util/getBookedPersons?currentUserEmail=' + localStorage.getItem('email'))
      .map((response: BookedUser[]) => response);
  }

  uploadVideo(file: File, email1, email2, inviteId) {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('fighterEmail1', email1);
    formdata.append('fighterEmail2', email2);
    formdata.append('inviteId', inviteId);

    return this.http.post(AppComponent.apiEndpoint + 'user/uploadVideo', formdata, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    });
  }

  unbookUser(email: any) {
    return this.http.get(AppComponent.apiEndpoint + 'util/unBookPerson?currentUserEmail=' + localStorage.getItem('email') + '&personEmail=' + email);
  }
  getUserInvites() {
    return this.http.get(AppComponent.apiEndpoint + 'util/getInvitesForUser?email=' + localStorage.getItem('email'))
      .map((response: Invite[]) => response);
  }

  invite() {
    return this.http.post(AppComponent.apiEndpoint + 'user/invite', AppComponent.invite, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    }).map((response: Invite) => response);

  }

  acceptInvite(invite: any) {
    return this.http.post(AppComponent.apiEndpoint + 'util/acceptInvite', invite);
  }

  getMarkers() {
    return this.http.get(AppComponent.apiEndpoint + 'util/getMarkers')
      .map((response: Invite[]) => response);
  }

  getNotification(email: string) {
    return this.http.get(AppComponent.apiEndpoint + 'util/getNotifications?email=' + email)
      .map((response: UserNotification[]) => response);
  }

  getPlannedFights(email: string) {
    return this.http.get(AppComponent.apiEndpoint + 'util/getPlannedFights?email=' + email)
      .map((response: Invite[]) => response);
  }

  uploadVideoAdmin(file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);

    return this.http.post(AppComponent.apiEndpoint + 'admin/uploadVideoToFacebook', formdata, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    });
  }
  getVideos() {
    return this.http.get(AppComponent.apiEndpoint + 'util/getVideos');
  }
}
