import {Component, ComponentFactoryResolver, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../services/userService';
import {MapComponent} from './map/map.component';
import {OverviewComponent} from './overview/overview.component';
import {SearchComponent} from './search/search.component';
import {AppComponent} from '../app.component';
import {BookedUsersComponent} from './bookedUsers/bookedUsers.component';
import {BookedUser} from '../models/bookedUser';
import {User} from '../models/user';
import {InvitesComponent} from './Invites/invites.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user: User;
  users: BookedUser[];
  invitationStyle = {
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

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => {
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
  }

  logout() {
    this.userService.logout();
  }

  onChangeFighter(email) {
    AppComponent.fighter2Email = email;
  }

  onFileChange(event) {
    if (AppComponent.fighter2Email == null) {
      alert('Choose a fighter first');
    } else {
      let reader = new FileReader();
      let file: File = event.target.files[0];
      if (file.type === "video/mp4") {
        this.userService.uploadVideo(file).subscribe(result => {
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
}
