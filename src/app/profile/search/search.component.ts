import {Component, ComponentFactoryResolver, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/userService';
import {UtilService} from '../../services/utilService';
import {Router} from '@angular/router';
import {BookedUser} from '../../models/bookedUser';
import {User} from '../../models/user';
import {UserProfileComponent} from '../seeProfile/userProfile.component';
import {ProfileComponent} from '../profile.component';
import {MapComponent} from '../map/map.component';
import {Invite} from '../../models/invite';
import {AppComponent} from '../../app.component';

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
  invitationStyle;
  invitationName;
  invitationSurname;
  bookedUsers: BookedUser[];
  isLoading = false;
  @ViewChild('bookedPerson') bookedPerson: ElementRef;

  constructor(private router: Router,
              private userService: UserService,
              private utilService: UtilService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.utilService.countries().then(countries => this.countries = countries);
    this.userService.getBookedPersons().subscribe(users => {
      this.bookedUsers = users
      this.search();
    });
  }

  search() {
    this.model.pageNum = this.page;
    this.userService.search(this.model).subscribe(users => {
      this.collectionSize = users.count;
      this.users = users.records;
    });
  }

  onChangeCountry(countryName) {
    this.isLoading = true;
    this.model.country = countryName;
    this.utilService.cities(countryName).subscribe(cities => {
      this.cities = cities;
      this.isLoading = false;
    });
  }

  onChangeCity(cityName) {
    this.model.city = cityName;
  }

  bookPerson(email: string) {
    let modalUser = new BookedUser();
    modalUser.email = email;
    this.bookedUsers.push(modalUser);
    this.userService.bookPerson(email);
    this.search();
  }

  isPersonBooked(email) {
    for (let index = 0; index < this.bookedUsers.length; index++) {
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

  inviteToFight(user: BookedUser) {
    this.invitationName.nativeElement.value = user.name;
    this.invitationSurname.nativeElement.value = user.surname;
    delete this.invitationStyle.display;
    AppComponent.invite = new Invite();
    const inviter = new BookedUser();
    inviter.email = localStorage.getItem('email');
    AppComponent.invite.fighterInviter = inviter;
    AppComponent.invite.fighterInvited = user;
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }
}
