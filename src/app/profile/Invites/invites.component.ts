import {Component, ComponentFactoryResolver} from '@angular/core';
import {UserService} from '../../services/userService';
import {Invite} from '../../models/invite';
import {MapComponent} from '../map/map.component';
import {UserProfileComponent} from '../seeProfile/userProfile.component';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'invites-component',
  templateUrl: './invites.component.html'
})
export class InvitesComponent {
  invites: Invite[] = [];
  div;
  invitationStyle;
  invitationName;
  invitationSurname;
  locale;
  page: number = 1;
  isLoading: boolean = true;
  collectionSize = 0;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.nextPage();
  }
  showPlace(coordinateX, coordinateY) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.latitude = coordinateX;
    ref.instance.longitude = coordinateY;
    ref.instance.locale = this.locale;
    ref.instance.userMarkers = [];
    ref.instance.userMarkers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }
  acceptInvite(invite) {
    invite.fighterInviter = {email: invite.fighterInviter.email, name: invite.fighterInviter.name, surname: invite.fighterInviter.surname};
    invite.fighterInvited = {email: invite.fighterInvited.email, name: invite.fighterInvited.name, surname: invite.fighterInvited.surname};
    invite.accepted = true;
    this.userService.acceptInvite(invite).subscribe();
    this.showPlace(invite.latitude, invite.longitude);
  }
  nextPage() {
    this.isLoading = true;
    this.userService.getUserInvites(this.page).subscribe(invites => {
      this.collectionSize = (Math.floor(invites.count / 3) + (invites.count % 3 != 0 ? 1 : 0)) * 10;
      this.invites = invites.records;
      this.isLoading = false;
    });
  }
  declineInvite(inviteId) {
    this.isLoading = true;
    this.userService.declineInvite(inviteId).subscribe(result => {
      this.nextPage();
      this.isLoading = false;
    });
  }
  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.instance.invitationStyle = this.invitationStyle;
    ref.instance.div = this.div;
    ref.instance.locale = this.locale;
    ref.instance.invitationName = this.invitationName;
    ref.instance.invitationSurname = this.invitationSurname;
    ref.changeDetectorRef.detectChanges();
  }
  startDialog(email: string) {
    this.userService.findUserByEmail(email).subscribe(user => {
      ProfileComponent.toggle(user)
    });
  }
}
