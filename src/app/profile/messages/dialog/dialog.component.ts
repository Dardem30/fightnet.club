import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../services/userService';
import {Message} from '../../../models/message';
import * as SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {AppComponent} from '../../../app.component';
import {SocketService} from '../../../services/socketService';
import {UserProfileComponent} from '../../seeProfile/userProfile.component';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit, OnDestroy {

  private serverUrl = AppComponent.apiEndpoint + 'socket';
  public static stompClient;
  email;
  messages: Message[];
  convMessage = '';
  div;

  constructor(private userService: UserService,
              private socketService: SocketService,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {
    this.userService.getDialog(localStorage.getItem('email'), this.email).subscribe(messages => {
      this.messages = messages;
    });
    let ws = new SockJS(this.serverUrl);
    DialogComponent.stompClient = Stomp.over(ws);
    let that = this;
    DialogComponent.stompClient.connect({
      'Authorization': localStorage.getItem('currentUser')
    }, function () {
      that.openSocket();
    });
  }

  ngOnDestroy(): void {
    DialogComponent.stompClient.disconnect();
  }

  sendMessage() {
    if (this.convMessage != null && this.convMessage != '') {
      const message: Message = new Message();
      message.text = this.convMessage;
      message.userSender = localStorage.getItem('email');
      message.userResiver = this.email;
      this.socketService.post(message).subscribe();
      this.convMessage = '';
    }
  }

  openProfile() {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = this.email;
    ref.changeDetectorRef.detectChanges();
  }

  openSocket() {
    DialogComponent.stompClient.subscribe('/socket-publisher/' + localStorage.getItem('email'), message => this.messages.push(JSON.parse(message.body)));
  }
}
