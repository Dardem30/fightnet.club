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
}
