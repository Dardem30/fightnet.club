import {Component, ComponentFactoryResolver, ElementRef, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../services/userService';
import {MapComponent} from './map/map.component';
import {OverviewComponent} from './overview/overview.component';
import {SearchComponent} from './search/search.component';
import {AppComponent} from '../app.component';
import {BookedUsersComponent} from './bookedUsers/bookedUsers.component';
import {BookedUser} from '../models/bookedUser';
import {User} from '../models/user';
import {InvitesComponent} from './Invites/invites.component';
import {NotificationComponent} from './notification/notification.component';
import {FightsComponent} from './fights/fights.component';
import {VideosComponent} from './videos/videos.component';
import {Message} from '../models/message';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {SocketService} from '../services/socketService';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private serverUrl = AppComponent.apiEndpoint + 'socket';
  isCustomSocketOpened = false;
  private stompClient;
  messages: Message[] = [];
  user: User;
  open = true;
  heightChecked = false;
  initHeight = 0;
  static showDialog;
  static dialogUser = new User();
  users: BookedUser[];
  socketConnectionIsOpen = false;
  invitationStyle = {
    'display': 'none'
  };
  adminStyle = {
    'display': 'none'
  };
  file: File;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('div', {read: ViewContainerRef}) div;
  @ViewChild('invitation', {read: ViewContainerRef}) invitation;
  @ViewChild('invitationName') invitationName;
  @ViewChild('invitationSurname') invitationSurname;
  @ViewChild('invitationFightStyle') invitationFightStyle;
  @ViewChild('invitationDate') invitationDate;
  @Input() textMessage;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private socketService: SocketService) {
  }

  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => {
      const roles = user.roles;
      for (let index = 0; index < roles.length; index++) {
        if (roles[index].name === 'ROLE_ADMIN') {
          user.isAdmin = true;
          delete this.adminStyle.display;
          break;
        }
      }
      this.user = user;
      AppComponent.user = user;
    });
    let factory = this.componentFactoryResolver.resolveComponentFactory(OverviewComponent);
    let ref = this.div.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
    this.userService.getBookedPersons().subscribe(users => this.users = users);
  }

  changeRoute(navigate: string): void {
    this.div.remove(1);
    if (navigate == 'map') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.invitationStyle = this.invitationStyle;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'overview') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(OverviewComponent);
      let ref = this.div.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'search') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(SearchComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.div = this.div;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'bookedUsers') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(BookedUsersComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.div = this.div;
      ref.instance.invitationStyle = this.invitationStyle;
      ref.instance.invitationName = this.invitationName;
      ref.instance.invitationSurname = this.invitationSurname;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'invites') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(InvitesComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.div = this.div;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'notification') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(NotificationComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.div = this.div;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'fights') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(FightsComponent);
      let ref = this.div.createComponent(factory);
      ref.instance.div = this.div;
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'videos') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(VideosComponent);
      let ref = this.div.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    }
  }

  logout() {
    this.userService.logout();
  }

  onChangeFighter(email) {
    AppComponent.fighter2Email = email;
  }

  onFileChange(event) {
    let file: File = event.target.files[0];
    if (file.type === 'video/mp4') {
      this.userService.uploadVideoAdmin(file).subscribe(result => {
        if (result === 'success') {
          alert('Successfully')
        } else {
          alert('Ooops something went wrong please contact with administrator (Sergey)')
        }
      })
    } else {
      alert('Wrong file format')
    }
  }

  updateBookedUsers() {
    this.userService.getBookedPersons().subscribe(users => this.users = users);
  }

  invite() {
    AppComponent.invite.fightStyle = this.invitationFightStyle.nativeElement.value;
    AppComponent.invite.date = new Date(this.invitationDate.nativeElement.value);
    AppComponent.invite.accepted = false;
    this.userService.invite().subscribe(response => {
      if (response.date != null) {
        this.invitationStyle = {
          'display': 'none'
        };
      } else {
        alert('Ooops something went wrong please contact with administrator (Sergey)')
      }
    });
  }

  closeChat() {
    this.stompClient.disconnect();
    this.socketConnectionIsOpen = false;
    ProfileComponent.showDialog = false;
  }

  slideToggle() {
    const chat = document.getElementById('chat');
    if (!this.heightChecked) {
      this.initHeight = chat.offsetHeight;
      this.heightChecked = true;
    }
    if (this.open) {
      this.open = false;
      chat.style.height = '0px';
    }
    else {
      this.open = true;
      chat.style.height = this.initHeight + 'px';
    }
  }

  static toggle(user) {
    this.dialogUser = user;
    this.showDialog = true;
  }

  checkOpen() {
    if (ProfileComponent.showDialog == true && this.socketConnectionIsOpen == false) {
      this.socketConnectionIsOpen = true;
      this.initializeWebSocketConnection();
    }
    return ProfileComponent.showDialog;
  }

  getDialogUser(): User {
    return ProfileComponent.dialogUser
  }

  sendMessage() {
    let message: Message = new Message()
    message.text = this.textMessage;
    message.userSender = this.user.email;
    message.userResiver = this.getDialogUser().email;
    this.socketService.post(message).subscribe()
  }

  initializeWebSocketConnection() {
    this.userService.getDialog(this.user.email, this.getDialogUser().email).subscribe(messages => {
      for (let message of messages) {
        if (message.userSender == this.user.email) {
          message.userSender = this.user.name + ' ' + this.user.surname;
        } else {
          message.userSender = this.getDialogUser().name + ' ' + this.getDialogUser().surname;
        }
      }
      this.messages = messages
    });
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({
      'Authorization': localStorage.getItem('currentUser')
    }, function () {
      that.openSocket();
    });
  }

  openSocket() {
    this.isCustomSocketOpened = true;
    this.stompClient.subscribe('/socket-publisher/' + this.user.email, (messageJson) => {
      let message = JSON.parse(messageJson.body);
      if (message.userSender == this.user.email) {
        message.userSender = this.user.name + ' ' + this.user.surname;
      } else {
        message.userSender = this.getDialogUser().name + ' ' + this.getDialogUser().surname;
      }
      this.messages.push(message);
    });
  }
}
