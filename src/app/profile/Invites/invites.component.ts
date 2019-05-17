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
    ref.instance.userMarkers = [];
    ref.instance.userMarkers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }
  acceptInvite(invite) {
    invite.fighterInviter = {email: invite.fighterInviter.email, name: invite.fighterInviter.name, surname: invite.fighterInviter.surname};
    invite.fighterInvited = {email: invite.fighterInvited.email, name: invite.fighterInvited.name, surname: invite.fighterInvited.surname};
    invite.accepted = true;
    this.userService.acceptInvite(invite).subscribe(response => {
      this.userService.getUserInvites(this.page).subscribe(invites => {
        this.collectionSize = invites.count;
        this.invites = invites.records;
        this.isLoading = false;
      });
    });
    this.showPlace(invite.latitude, invite.longitude);
  }
  nextPage() {
    this.isLoading = true;
    this.userService.getUserInvites(this.page).subscribe(invites => {
      this.collectionSize = invites.count;
      this.invites = invites.records;
      this.isLoading = false;
    });
  }
  declineInvite(inviteId) {
    console.log('decline')
  }
}
