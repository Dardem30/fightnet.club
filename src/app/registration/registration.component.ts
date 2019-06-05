import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/authService';
import {UtilService} from '../services/utilService';
import Swal from "sweetalert2";

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  model: any = {
    email: null,
    password: null,
    name: null,
    surname: null,
    country: null,
    city: null,
    description: null
  };
  error = '';
  countries: Country[];
  cities: City[];
  agreeWithTermsOfUse:boolean = false;
  isLoading:boolean = false;

  constructor(private router: Router,
              private authenticationService: AuthService,
              private utilService: UtilService) {
  }

  ngOnInit() {
    this.utilService.countries().then(countries => this.countries = countries);
  }

  registration() {
    let message = '<ul>';
    let showMessage = false;
    for (const prop in this.model) {
      if (this.model[prop] == null) {
        showMessage = true;
        message += '<li>' + prop + '</li>'
      }
    }
    message += '</ul>';
    if (showMessage) {
      Swal.fire({
        html: 'Please, fill the following fields: <br>' + message,
        type: 'info',
        showConfirmButton: true,
        width: 300
      });
      return;
    }
    if (!this.agreeWithTermsOfUse) {
      Swal.fire({
        title: 'Please, accept our terms of use and privacy policy and try again',
        type: 'info',
        showConfirmButton: true,
        width: 600
      });
      return;
    }
    this.authenticationService.sendCode(this.model).subscribe(res => {
      if (res.text() == 'false') {
        Swal.fire({
          title: 'Sorqry but user with this email already exists.',
          html: 'If you have a code from this email please enter it <a href="/confirmCode/' + this.model.email + '">here</a>',
          type: 'error',
          showConfirmButton: true,
          width: 600
        });
      } else {
        Swal.fire({
          title: 'We email you confirm code plese enter it here',
          type: 'success',
          showConfirmButton: true,
          width: 600
        });
        this.router.navigate(['confirmCode', this.model.email]);
      }
    });;
  }

  onChangeCountry(countryName) {
    this.isLoading = true;
    this.utilService.cities(countryName).subscribe(cities => {
      this.cities = cities;
      this.isLoading = false;
    });
  }
}
