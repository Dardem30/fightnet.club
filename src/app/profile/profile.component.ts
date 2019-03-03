import {Component, ComponentFactoryResolver, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../services/userService';
import {MapComponent} from "./map/map.component";
import {OverviewComponent} from "./overview/overview.component";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user: User;
  @ViewChild('div', {read: ViewContainerRef}) div;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => this.user = user);
    let factory = this.componentFactoryResolver.resolveComponentFactory(OverviewComponent);
    let ref = this.div.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
  changeRoute(navigate: string) : void {
    this.div.remove(1);
    if (navigate == 'map') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
      let ref = this.div.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    }
    if (navigate == 'overview') {
      let factory = this.componentFactoryResolver.resolveComponentFactory(OverviewComponent);
      let ref = this.div.createComponent(factory);
      ref.changeDetectorRef.detectChanges();
    }
  }
}
