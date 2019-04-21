import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Message} from '../models/message';
import {AppComponent} from '../app.component';
import {Comment} from '../models/comment';

@Injectable()
export class SocketService {

  constructor(private http: HttpClient) {
  }

  post(data: Message) {
    return this.http.post(AppComponent.apiEndpoint + 'message/send', data)
      .map((data: Message) => {
        return data;
      });
  }

  postComment(data: Comment) {
    return this.http.post(AppComponent.apiEndpoint + 'message/sendComment', data)
      .map((data: Comment) => {
        return data;
      });
  }
}
