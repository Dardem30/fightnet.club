import {Component, ComponentFactoryResolver} from '@angular/core';
import {AppComponent} from '../../app.component';
import {UserService} from '../../services/userService';
import {UserProfileComponent} from '../seeProfile/userProfile.component';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html'
})
export class MapComponent {
  latitude = 15;
  longitude = 15;
  invitationStyle;
  div;
  userMarkers = [];
  markers = [];

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit() {
    this.userService.getMarkers().subscribe(markers => {
      console.log(markers);
      this.markers = markers
    });
  }

  placeMarker(position: any) {
    if (this.invitationStyle == null) { // if invitation is visible
      this.userMarkers = [];
      const lat = position.coords.lat;
      const lng = position.coords.lng;
      AppComponent.invite.latitude = lat;
      AppComponent.invite.longitude = lng;
      this.userMarkers.push({latitude: lat, longitude: lng});
    }
  }
  markerClick(infoWindow) {
    infoWindow.open();
  }
  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.changeDetectorRef.detectChanges();
  }
}
