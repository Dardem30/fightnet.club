import {Component, ComponentFactoryResolver} from '@angular/core';
import {User} from '../../models/user';
import {ChartOptions, ChartType} from 'chart.js';
import {UserService} from '../../services/userService';
import {Label} from 'ng2-charts';
import {ProfileComponent} from '../profile.component';
import {MapComponent} from '../map/map.component';
import {AppComponent} from '../../app.component';
import {Invite} from '../../models/invite';
import {BookedUser} from '../../models/bookedUser';
import * as enLocalization from '../../../localization/fightnet.en';
import * as ruLocalization from '../../../localization/fightnet.ru';

@Component({
  selector: 'userProfile',
  templateUrl: './userProfile.component.html'
})
export class UserProfileComponent {
  user: User;
  email: string;
  invitationStyle;
  invitationName;
  invitationSurname;
  div;
  locale = AppComponent.isEnglish ? enLocalization : ruLocalization;
  public accessTokenFacebook: string;
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

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {}
  ngOnInit() {
    this.userService.getFacebookAccessToken().subscribe(result => this.accessTokenFacebook = result);
    this.userService.findUserByEmail(this.email).subscribe(user => {
      for (let keyWins in user.wins) {
        this.hasNoWins = false;
        this.countWins += user.wins[keyWins];
        this.pieChartLabelsWins.push(keyWins);
        this.pieChartDataWins.push(user.wins[keyWins]);
      }
      if (this.hasNoWins) {
        document.getElementById("wins").style.display = "none";
      }
      for (let keyLoses in user.loses) {
        this.hasNoLoses = false;
        this.countLoses += user.loses[keyLoses];
        this.pieChartLabelsLoses.push(keyLoses);
        this.pieChartDataLoses.push(user.loses[keyLoses]);
      }
      if (this.hasNoLoses) {
        document.getElementById("loses").style.display = "none";
      }
      this.user = user
    });
  }
  inviteToFight() {
    this.invitationName.nativeElement.value = this.user.name;
    this.invitationSurname.nativeElement.value = this.user.surname;
    delete this.invitationStyle.display;
    AppComponent.invite = new Invite();
    const inviter = new BookedUser();
    inviter.email = localStorage.getItem('email');
    AppComponent.invite.fighterInviter = inviter;
    AppComponent.invite.fighterInvited = this.user;
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.changeDetectorRef.detectChanges();
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
  dialog() {
    ProfileComponent.toggle(this.user);
  }
  gallery() {
    const win = window.open('', '', 'width=1400,height=750');
    win.document.write('<style>@import url("https://fonts.googleapis.com/css?family=Nunito+Sans|Playfair+Display:400,400i,700,700i,900,900i"); * { box-sizing: border-box; border-radius: 5px; } body { margin: 0; background-color: #eee; background-image: url("https://artwalls.com.ua/image/catalog/fpz/5aa697c28ee373D-287_ham_o.jpg"); background-size: cover; } main { min-height: 100vh; display: grid; grid-template-columns: 100vw 100vw 100vw; width: 300vw; justify-content: center; align-items: center; } figure { max-width: 50vw; margin: 0 auto; background: rgba(255,255,255,0.8); padding: 2em; border: 1px solid #ddd; box-shadow: 0 0 2em -0.5em #aaa; position: relative; } figure img { max-width: 100%; max-height: 70vh; } figure figcaption { font-family: "Playfair Display"; font-weight: 900; font-size: 3em; font-style: italic; text-align: right; text-shadow: 0 0 1em #555; text-shadow: 0 0 0.5em white; position: absolute; right: -2rem; bottom: -2rem; } .helper { position: absolute; top: 0; left: 0; margin: 1rem; text-align: center; font-family: "Nunito Sans"; opacity: .45; font-size: 1.2em; transition: opacity, .15s; } .helper:hover { opacity: 1; }</style>');
    win.document.write(document.getElementById('gallery').outerHTML);
    win.document.close();
  }
}
