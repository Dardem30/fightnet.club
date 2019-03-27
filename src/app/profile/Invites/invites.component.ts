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
    ref.instance.markers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }
  acceptInvite(invite) {
    invite.fighterInviter = {email: invite.fighterInviter.email}
    invite.fighterInvited = {email: invite.fighterInvited.email}
    invite.accepted = true;
    this.userService.updateInvite(invite).subscribe(response => {
      this.userService.getUserInvites().subscribe(invites => this.invites = invites);
    })
  }
  declineInvite(inviteId) {
    console.log('decline')
  }
}
