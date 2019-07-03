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
import {Message} from '../models/message';
import {Video} from '../models/video';
import {ProfileComponent} from '../profile/profile.component';
import {Comment} from '../models/comment';
import {SearchResponse} from '../models/searchResponse';

@Injectable()
export class UserService {
  constructor(private http: HttpClient
    , private router: Router) {
  }

  findUserByEmail(email: string): Observable<User> {
    return this.http.post(AppComponent.apiEndpoint + 'util/findUser', {email: email})
      .map((response: User) => response);
  }

  search(model): Observable<SearchResponse<User>> {
    model.searcherEmail = localStorage.getItem('email');
    return this.http.post(AppComponent.apiEndpoint + 'util/listUsers', model)
      .map((response: SearchResponse<User>) => response);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['']);
  }

  bookPerson(email: any) {
    console.log(email);
    this.http.post(AppComponent.apiEndpoint + 'util/bookPerson', {currentUserEmail: localStorage.getItem('email'), personEmail: email})
      .subscribe();
  }

  getBookedPersons(): Observable<BookedUser[]> {
    return this.http.post(AppComponent.apiEndpoint + 'util/getBookedPersons', {currentUserEmail: localStorage.getItem('email')})
      .map((response: BookedUser[]) => response);
  }

  uploadVideo(file: File, email1, email2, inviteId, style) {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('fighterEmail1', email1);
    formdata.append('fighterEmail2', email2);
    formdata.append('inviteId', inviteId);
    formdata.append('style', style);

    return this.http.post(AppComponent.apiEndpoint + 'user/uploadVideo', formdata, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    });
  }
  uploadPhoto(file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);
    formdata.append('email', localStorage.getItem("email"));

    return this.http.post(AppComponent.apiEndpoint + 'user/uploadPhoto', formdata, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    });
  }

  unbookUser(email: any) {
    return this.http.post(AppComponent.apiEndpoint + 'util/unBookPerson', {currentUserEmail: localStorage.getItem('email'), email: email});
  }

  getUserInvites(page: number) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getInvitesForUser', {email: localStorage.getItem("email"), page: page})
      .map((response: SearchResponse<Invite>) => response);
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

  getMarkers(model) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getMarkers', model)
      .map((response: Invite[]) => response);
  }

  getNotification(email: string) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getNotifications', {email: email})
      .map((response: UserNotification[]) => response);
  }

  getPlannedFights(email: string, page: number) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getPlannedFights', {email: email, page: page})
      .map((response: SearchResponse<Invite>) => response);
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
  uploadImageAdmin(file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file, file.name);

    return this.http.post(AppComponent.apiEndpoint + 'admin/uploadPhotoToFacebook', formdata, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    });
  }
  getVideos() {
    return this.http.get(AppComponent.apiEndpoint + 'util/getVideos');
  }

  getDialog(email1, email2) {
    return this.http.post(AppComponent.apiEndpoint + 'message/getDialog', {email1: email1, email2: email2}, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    }).map((response: Message[]) => response);
  }

  updateVideo(video: Video) {
    this.http.post(AppComponent.apiEndpoint + 'util/vote', video).subscribe();
  }
  static getComments(): Comment[] {
    return ProfileComponent.comments;
  }


  getConversations(email: string) {
    return this.http.post(AppComponent.apiEndpoint + 'message/getConversations', {email: email}, {
      headers: {
        'Authorization': localStorage.getItem('currentUser')
      }
    }).map((response: Message[]) => response);
  }

  searchVideo(model: any) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getVideos', model)
      .map((response: SearchResponse<Video>) => response);
  }

  resetNotifications(email: string) {
    return this.http.post(AppComponent.apiEndpoint + 'util/resetNotifications', {email: email});
  }

  resetMessages(email: string) {
    return this.http.post(AppComponent.apiEndpoint + 'util/resetMessages', {email: email});
  }

  getCommentsPhotos(emails: string[]) {
    return this.http.post(AppComponent.apiEndpoint + 'util/getCommentsPhotos', {emails: emails});
  }

  updateUserChangableInfo(user: User) {
    this.http.post(AppComponent.apiEndpoint + 'util/updateChangableInfoToUser', user).subscribe();
  }

  declineInvite(inviteId: any) {
    const formdata: FormData = new FormData();
    formdata.append('inviteId', inviteId);
    return this.http.post(AppComponent.apiEndpoint + 'util/declineInvite', formdata);
  }

  getFacebookAccessToken() {
    return this.http.get(AppComponent.apiEndpoint + 'util/getFacebookAccessToken', {responseType: 'text'})
  }

  makeMainPhoto(email: string, indexOfPhoto: number) {
    return this.http.post(AppComponent.apiEndpoint + 'util/makeMainPhoto', {email: email, indexOfPhoto: indexOfPhoto});
  }
}
