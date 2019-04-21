import {Component} from '@angular/core';
import {UserService} from '../../services/userService';
import {User} from '../../models/user';
import {Label} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'overview-component',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
  user: User;
  private hasNoWins = true;
  private hasNoLoses = true;
  private pieChartLabelsWins: Label[] = [];
  private pieChartDataWins: number[] = [];
  private pieChartLabelsLoses: Label[] = [];
  private pieChartDataLoses: number[] = [];
  private pieChartType: ChartType = 'pie';
  private pieChartColors = [
    {
      backgroundColor: ['#546e7a', '#F4511E', '#AC0A0A', '#1a8a34', '#673ab7', '#566375', '#E64A19', '#212121', '#e62727'],
    },
  ];

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.findUserByEmail(localStorage.getItem('email')).subscribe(user => {
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
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

}
