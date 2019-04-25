import {Component} from '@angular/core';
import {AppComponent} from '../../app.component';
import {UserService} from '../../services/userService';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html'
})
export class MapComponent {
  latitude = 15;
  longitude = 15;
  invitationStyle;
  userMarkers = [];
  markers = [];

  constructor(private userService: UserService) {

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
}
