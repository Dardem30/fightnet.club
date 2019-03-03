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
  city: City;
  country: Country;

  constructor(private router: Router,
              private authenticationService: AuthService,
              private utilService: UtilService) {
  }

  ngOnInit() {
    this.utilService.countries().then(countries => this.countries = countries);
  }

  registration() {
    this.model.city = this.city;
    this.model.country = this.country;
    this.authenticationService.sendCode(this.model);
  }

  onChangeCountry(cities, countryName) {//fuck Brandon Aik
    //TODO find the way to convert [object] to normal JSON country
    for (let country of this.countries) {
      if (country.name = countryName) {
        this.country = country;
        break;
      }
    }
    this.cities = JSON.parse(cities);
  }

  onChangeCity(cityName) {//fuck Brandon Aik
    //TODO find the way to convert [object] to normal JSON city
    for (let city of this.cities) {
      if (city.name = cityName) {
        this.city = city;
        break;
      }
    }
  }
}
