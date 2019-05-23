import {Component, ComponentFactoryResolver} from '@angular/core';
import {UserService} from '../../services/userService';
import {BookedUser} from '../../models/bookedUser';
import {AppComponent} from '../../app.component';
import {MapComponent} from '../map/map.component';
import {Invite} from '../../models/invite';
import {UserProfileComponent} from '../seeProfile/userProfile.component';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'booked-users-component',
  templateUrl: './bookedUsers.component.html'
})
export class BookedUsersComponent {
  users: BookedUser[] = [];
  div;
  invitationStyle;
  invitationName;
  invitationSurname;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.userService.getBookedPersons().subscribe(users => this.users = users);
  }
  unBookPerson(email) {
    this.userService.unbookUser(email).subscribe(response => this.userService.getBookedPersons().subscribe(users => this.users = users))
  }

  inviteToFight(user: BookedUser) {
    this.invitationName.nativeElement.value = user.name;
    this.invitationSurname.nativeElement.value = user.surname;
    delete this.invitationStyle.display;
    AppComponent.invite = new Invite();
    const inviter = new BookedUser();
    inviter.email = localStorage.getItem('email');
    AppComponent.invite.fighterInviter = inviter;
    AppComponent.invite.fighterInvited = user;
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.changeDetectorRef.detectChanges();
  }
  dialog(email: string) {
    this.userService.findUserByEmail(email).subscribe(user => {
      ProfileComponent.toggle(user)
    });
  }
}
