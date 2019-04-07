import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Message} from '../models/message';
import {AppComponent} from '../app.component';

@Injectable()
export class SocketService {

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post(AppComponent.apiEndpoint + 'message/send', data)
      .map((data: Message) => { return data; });
  }
}
