import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/authService';


@Component({
  selector: 'confirmCode',
  templateUrl: './confirmCode.component.html'
})
export class ConfirmCodeComponent {
  code: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthService) { }

  confirmCode() {
    this.authenticationService.registration(this.route.snapshot.params['email'], this.code);
  }
}
