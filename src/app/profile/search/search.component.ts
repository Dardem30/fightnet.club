import {Component, ComponentFactoryResolver, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/userService';
import {UtilService} from '../../services/utilService';
import {Router} from '@angular/router';
import {BookedUser} from '../../models/bookedUser';
import {User} from '../../models/user';
import {UserProfileComponent} from '../seeProfile/userProfile.component';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  model: any = {};
  page = 1;
  collectionSize = 0;
  div;
  countries: Country[];
  cities: City[];
  users: User[];
  bookedUsers: BookedUser[];
  @ViewChild('bookedPerson') bookedPerson: ElementRef;

  constructor(private router: Router,
              private userService: UserService,
              private utilService: UtilService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.utilService.countries().then(countries => this.countries = countries);
    this.userService.getBookedPersons().subscribe(users => this.bookedUsers = users);
  }

  search() {
    this.model.pageNum = this.page;
    this.userService.search(this.model).subscribe(users => {
      console.log(users);
      this.collectionSize = users.count;
      this.users = users.records;
    });
  }

  onChangeCountry(countryName) {
    if (countryName != null && countryName != '') {
      for (let country of this.countries) {
        if (country.name === countryName) {
          this.model.country = country.id;
          this.cities = JSON.parse(country.transientJSONField);
          break;
        }
      }
    } else {
      delete this.model.country;
    }
  }

  onChangeCity(cityName) {
    if (cityName != null && cityName != '') {
      for (let city of this.cities) {
        if (city.name === cityName) {
          this.model.city = city.id;
          break;
        }
      }
    } else {
      delete this.model.city;
    }
  }

  bookPerson(email: string) {
    let modalUser = new BookedUser();
    modalUser.email = email;
    this.bookedUsers.push(modalUser);
    this.userService.bookPerson(email);
    this.search();
  }

  isPersonBooked(email) {
    for (var index = 0; index < this.bookedUsers.length; index++) {
      if (this.bookedUsers[index].email == email) {
        return false;
      }
    }
    return true;
  }

  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.changeDetectorRef.detectChanges();
  }

  dialog(email: string) {
    this.userService.findUserByEmail(email).subscribe(user => {
      ProfileComponent.toggle(user)
    });
  }

}
