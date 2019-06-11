import {Component, ComponentFactoryResolver} from '@angular/core';
import {UserService} from '../../services/userService';
import {UserNotification} from '../../models/notification';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'notification-component',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  notifications: UserNotification[] = [];
  isLoading: boolean = true;
  div;
  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }
  ngOnInit() {
    this.userService.getNotification(localStorage.getItem('email')).subscribe(notifications => {
      this.notifications = notifications;
      this.isLoading = false;
    });
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
}
