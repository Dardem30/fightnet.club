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
  conversations: Message[];

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }
  ngOnInit() {
    this.userService.getConversations(localStorage.getItem("email")).subscribe(conversations => this.conversations = conversations);
  }

  dialog(email1: string, email2: string, titleName: string) {
    this.div.remove(1);
    const ref = this.div.createComponent(this.componentFactoryResolver.resolveComponentFactory(DialogComponent));
    ref.instance.email = email1 === localStorage.getItem("email") ? email2 : email1;
    ref.changeDetectorRef.detectChanges();
  }
}
