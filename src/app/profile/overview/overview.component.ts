import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/userService';
import {User} from '../../models/user';
import {Label} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';
import {UtilService} from '../../services/utilService';
import Swal from "sweetalert2";

@Component({
  selector: 'overview-component',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
  user: User;
  countries: Country[];
  cities: City[];
  isLoading: boolean = false;
  public countWins: number = 0;
  public countLoses: number = 0;
  public hasNoWins = true;
  public hasNoLoses = true;
  public pieChartLabelsWins: Label[] = [];
  public pieChartDataWins: number[] = [];
  public pieChartLabelsLoses: Label[] = [];
  public pieChartDataLoses: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['#C01B1B', '#4480BD', '#57BD44', '#DED830', '#5104B2', '#566375', '#E64A19', '#212121', '#e62727'],
    },
  ];
  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(private userService: UserService,
              private utilService: UtilService) {
  }

  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => {
      for (let keyWins in user.wins) {
        this.hasNoWins = false;
        this.countWins += user.wins[keyWins];
        this.pieChartLabelsWins.push(keyWins);
        this.pieChartDataWins.push(user.wins[keyWins]);
      }
      if (this.hasNoWins) {
        document.getElementById('wins').style.display = 'none';
      }
      for (let keyLoses in user.loses) {
        this.hasNoLoses = false;
        this.countLoses += user.loses[keyLoses];
        this.pieChartLabelsLoses.push(keyLoses);
        this.pieChartDataLoses.push(user.loses[keyLoses]);
      }
      if (this.hasNoLoses) {
        document.getElementById('loses').style.display = 'none';
      }
      this.user = user;
    });
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return ctx.chart.data.labels[ctx.dataIndex];
        },
      },
    }
  };

  gallery() {
    const win = window.open('', '', 'width=1400,height=750');
    win.document.write('<style>@import url("https://fonts.googleapis.com/css?family=Nunito+Sans|Playfair+Display:400,400i,700,700i,900,900i"); * { box-sizing: border-box; border-radius: 5px; } body { margin: 0; background-color: #eee; background-image: url("https://artwalls.com.ua/image/catalog/fpz/5aa697c28ee373D-287_ham_o.jpg"); background-size: cover; } main { min-height: 100vh; display: grid; grid-template-columns: 100vw 100vw 100vw; width: 300vw; justify-content: center; align-items: center; } figure { max-width: 50vw; margin: 0 auto; background: rgba(255,255,255,0.8); padding: 2em; border: 1px solid #ddd; box-shadow: 0 0 2em -0.5em #aaa; position: relative; } figure img { max-width: 100%; max-height: 70vh; } figure figcaption { font-family: "Playfair Display"; font-weight: 900; font-size: 3em; font-style: italic; text-align: right; text-shadow: 0 0 1em #555; text-shadow: 0 0 0.5em white; position: absolute; right: -2rem; bottom: -2rem; } .helper { position: absolute; top: 0; left: 0; margin: 1rem; text-align: center; font-family: "Nunito Sans"; opacity: .45; font-size: 1.2em; transition: opacity, .15s; } .helper:hover { opacity: 1; }</style>');
    win.document.write(document.getElementById('gallery').outerHTML);
    win.document.close();
  }

  uploadPhoto(event) {
    let file: File = event.target.files[0];
    this.userService.uploadPhoto(file).subscribe();
    Swal.fire({
      title: 'You successfully upload photo. When photo pass the review you will see this photo in your gallery ',
      type: 'success',
      showConfirmButton: true,
      width: 600
    });
  }
  setupPlace() {
    this.utilService.countries().then(countries => this.countries = countries);
    (<HTMLInputElement> document.getElementById('country')).value = this.user.country;
    (<HTMLInputElement> document.getElementById('city')).value = this.user.city;
  }
  onChangeCountry(countryName) {
    this.isLoading = true;
    this.utilService.cities(countryName).subscribe(cities => {
      this.cities = cities;
      this.isLoading = false;
    });
  }
  setupWidth() {
    (<HTMLInputElement> document.getElementById('changeWidth')).value = this.user.weight
  }
  setupGrowth() {
    (<HTMLInputElement> document.getElementById('changeGrowth')).value = this.user.growth
  }
  setupPrefferable() {
    if (this.user.preferredKind != null) {
      (<HTMLInputElement> document.getElementById('fightStyles')).value = this.user.preferredKind
    }
  }
  updateDesctiption() {
    this.user.description = (<HTMLInputElement> document.getElementById('changeDesctiption')).value;
    this.userService.updateUserChangableInfo(this.user);
  }
  updateWidth() {
    this.user.weight = (<HTMLInputElement> document.getElementById('changeWidth')).value;
    this.userService.updateUserChangableInfo(this.user);
  }
  updateGrowth() {
    this.user.growth = (<HTMLInputElement> document.getElementById('changeGrowth')).value;
    this.userService.updateUserChangableInfo(this.user);
  }
  updatePrefferable() {
    this.user.preferredKind = (<HTMLInputElement> document.getElementById('fightStyles')).value;
    this.userService.updateUserChangableInfo(this.user);
  }
  updatePlace() {
    const country = (<HTMLInputElement> document.getElementById('country')).value;
    const city = (<HTMLInputElement> document.getElementById('city')).value;
    if (city != null && city != '' && country != null && country != '') {
      this.user.country = country;
      this.user.city = city;
      this.userService.updateUserChangableInfo(this.user);
      document.getElementById('placeModal').style.display = 'none';
    } else {
      Swal.fire({
        title: 'Please, specify your country and city',
        type: 'error',
        showConfirmButton: true,
        width: 600
      });
    }
  }
}
