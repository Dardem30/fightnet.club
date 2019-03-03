import {Component, ComponentFactoryResolver} from '@angular/core';
import {UserService} from "../../services/userService";

@Component({
  selector: 'overview-component',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
  user: User;
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => this.user = user);
  }
}
