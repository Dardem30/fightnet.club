import {Component} from '@angular/core';
import {User} from '../../models/user';

@Component({
  selector: 'userProfile',
  templateUrl: './userProfile.component.html'
})
export class UserProfileComponent {
  user: User;
}
