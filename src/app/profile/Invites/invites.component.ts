import {Component, ComponentFactoryResolver} from '@angular/core';
import {UserService} from '../../services/userService';
import {Invite} from '../../models/invite';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'invites-component',
  templateUrl: './invites.component.html'
})
export class InvitesComponent {
  invites: Invite[];
  div;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.userService.getUserInvites().subscribe(invites => this.invites = invites);
  }
  showPlace(coordinateX, coordinateY) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.latitude = coordinateX;
    ref.instance.longitude = coordinateY;
    ref.instance.userMarkers = [];
    ref.instance.userMarkers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }
  acceptInvite(invite) {
    invite.fighterInviter = {email: invite.fighterInviter.email, name: invite.fighterInviter.name, surname: invite.fighterInviter.surname};
    invite.fighterInvited = {email: invite.fighterInvited.email, name: invite.fighterInvited.name, surname: invite.fighterInvited.surname};
    invite.accepted = true;
    this.userService.acceptInvite(invite).subscribe(response => {
      this.userService.getUserInvites().subscribe(invites => this.invites = invites);
    })
  }
  declineInvite(inviteId) {
    console.log('decline')
  }
}
