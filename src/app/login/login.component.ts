import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/authService';


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  model: any = {};

  constructor(
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
    console.log('login1');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
  }

  login() {
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['profile']);
        } else {
          alert('Username or password is incorrect');
        }
      });
  }
}
