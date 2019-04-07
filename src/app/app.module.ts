import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthGuard} from './guard/authGuard';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/authService';
import {UtilService} from './services/utilService';
import {ConfirmCodeComponent} from './registration/confirmCode/confirmCode.component';
import {ProfileComponent} from './profile/profile.component';
import {UserService} from './services/userService';
import {AgmCoreModule} from '@agm/core';
import {MapComponent} from './profile/map/map.component';
import {OverviewComponent} from './profile/overview/overview.component';
import {SearchComponent} from './profile/search/search.component';
import {BookedUsersComponent} from './profile/bookedUsers/bookedUsers.component';
import {InvitesComponent} from './profile/Invites/invites.component';
import {NotificationComponent} from './profile/notification/notification.component';
import {FightsComponent} from './profile/fights/fights.component';
import {VideosComponent} from './profile/videos/videos.component';
import {UserProfileComponent} from './profile/seeProfile/userProfile.component';
import {ToastrModule} from 'ngx-toastr';
import {SocketService} from './services/socketService';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'confirmCode/:email', component: ConfirmCodeComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ConfirmCodeComponent,
    ProfileComponent,
    MapComponent,
    OverviewComponent,
    SearchComponent,
    BookedUsersComponent,
    InvitesComponent,
    NotificationComponent,
    FightsComponent,
    VideosComponent,
    UserProfileComponent
  ],
  entryComponents: [
    MapComponent,
    OverviewComponent,
    SearchComponent,
    BookedUsersComponent,
    InvitesComponent,
    NotificationComponent,
    FightsComponent,
    VideosComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ToastrModule.forRoot({ timeOut: 3000 }),
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDitSMGPO5DNKKpDcILf7-3_aOOWeZStCw'
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard, SocketService, AuthService, UtilService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
