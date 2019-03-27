import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/authService';
import {UtilService} from '../services/utilService';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  model: any = {};
  error = '';
  countries: Country[];
  cities: City[];

  constructor(private router: Router,
              private authenticationService: AuthService,
              private utilService: UtilService) {
  }

  ngOnInit() {
    this.utilService.countries().then(countries => this.countries = countries);
  }

  registration() {
    this.authenticationService.sendCode(this.model);
  }

  onChangeCountry(countryName, tet) {
    for (let country of this.countries) {
      if (country.name === countryName) {
        this.model.country = country;
        this.cities = JSON.parse(country.transientJSONField);
        break;
      }
    }
  }
  onChangeCity(cityName) {
    for (let city of this.cities) {
      if (city.name === cityName) {
        this.model.city = city;
        break;
      }
    }
  }
}
