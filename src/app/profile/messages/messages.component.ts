import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {DialogComponent} from './dialog/dialog.component';
import {UserService} from '../../services/userService';
import {Message} from '../../models/message';

@Component({
  selector: 'messages-component',
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{
  div;
  public accessTokenFacebook: string;
  isLoading: boolean = true;
  conversations: Message[] = [];

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }
  ngOnInit() {
    this.userService.getFacebookAccessToken().subscribe(result => this.accessTokenFacebook = result);
    this.userService.getConversations(localStorage.getItem("email")).subscribe(conversations => {
      this.conversations = conversations;
      this.isLoading = false;
    });
  }

  dialog(email1: string, email2: string, titleName: string, photo: string) {
    this.div.remove(1);
    const ref = this.div.createComponent(this.componentFactoryResolver.resolveComponentFactory(DialogComponent));
    ref.instance.div = this.div;
    ref.instance.email = email1 === localStorage.getItem("email") ? email2 : email1;
    ref.instance.userPhoto = photo;
    ref.instance.accessTokenFacebook = this.accessTokenFacebook;
    ref.changeDetectorRef.detectChanges();
  }
  setConvestaions() {
    this.userService.getConversations(localStorage.getItem("email")).subscribe(conversations => this.conversations = conversations);
  }
}
