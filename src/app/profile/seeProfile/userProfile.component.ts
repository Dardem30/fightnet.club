import {Component} from '@angular/core';
import {User} from '../../models/user';
import {ChartOptions, ChartType} from 'chart.js';
import {UserService} from '../../services/userService';
import {Label} from 'ng2-charts';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'userProfile',
  templateUrl: './userProfile.component.html'
})
export class UserProfileComponent {
  user: User;
  email: string;
  public hasNoWins = true;
  public hasNoLoses = true;
  public pieChartLabelsWins: Label[] = [];
  public pieChartDataWins: number[] = [];
  public pieChartLabelsLoses: Label[] = [];
  public pieChartDataLoses: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['#546e7a', '#F4511E', '#AC0A0A', '#1a8a34', '#673ab7', '#566375', '#E64A19', '#212121', '#e62727'],
    },
  ];

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.findUserByEmail(this.email).subscribe(user => {
      for (let keyWins in user.wins) {
        this.hasNoWins = false;
        this.pieChartLabelsWins.push(keyWins);
        this.pieChartDataWins.push(user.wins[keyWins]);
      }
      if (this.hasNoWins) {
        document.getElementById("wins").style.display = "none";
      }
      for (let keyLoses in user.loses) {
        this.hasNoLoses = false;
        this.pieChartLabelsLoses.push(keyLoses);
        this.pieChartDataLoses.push(user.loses[keyLoses]);
      }
      if (this.hasNoLoses) {
        document.getElementById("loses").style.display = "none";
      }
      this.user = user
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
  dialog() {
    ProfileComponent.toggle(this.user);
  }
}
