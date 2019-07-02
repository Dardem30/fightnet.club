import {Component, ComponentFactoryResolver, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/userService';
import {Invite} from '../../models/invite';
import {MapComponent} from '../map/map.component';
import {UserProfileComponent} from '../seeProfile/userProfile.component';
import Swal from "sweetalert2";
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'fights-component',
  templateUrl: './fights.component.html'
})
export class FightsComponent {
  invites: Invite[] = [];
  isLoading: boolean = true;
  loggedInUserEmail: string = localStorage.getItem('email');
  div;
  locale;
  fighterInviter;
  fighterInvited;
  invitationStyle;
  invitationName;
  invitationSurname;
  style;
  page: number = 1;
  collectionSize = 0;
  @ViewChild('file') file: ElementRef;
  inviteId;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.nextPage();
  }
  nextPage() {
    this.isLoading = true;
    this.userService.getPlannedFights(localStorage.getItem('email'), this.page).subscribe(invites => {
      this.isLoading = false;
      this.collectionSize = (Math.floor(invites.count / 3) + (invites.count % 3 != 0 ? 1 : 0)) * 10;
      this.invites = invites.records;
    });
  }

  showPlace(coordinateX, coordinateY) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.latitude = coordinateX;
    ref.instance.longitude = coordinateY;
    ref.instance.locale = this.locale;
    ref.instance.userMarkers = [];
    ref.instance.userMarkers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }

  onFileChange(event) {
    this.isLoading = true;
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (file.type === 'video/mp4') {
      this.userService.uploadVideo(file, this.fighterInviter, this.fighterInvited, this.inviteId, this.style).subscribe(result => {
        if (result === 'success') {
          alert('Successfully')
        } else {
          alert('Ooops something went wrong please contact with administrator (Sergey)')
        }
      });
      Swal.fire({
        title: 'You successfully upload video. When it pass the review you will see this video on tab "Videos"',
        type: 'success',
        showConfirmButton: true,
        width: 600
      }).then(() => {
        this.nextPage();
      });
    } else {
      alert('Wrong file format')
    }
  }

  setFighters(invite) {
    this.fighterInviter = invite.fighterInviter.email;
    this.fighterInvited = invite.fighterInvited.email;
    this.inviteId = invite.id;
    this.style = invite.fightStyle;
    (this.file.nativeElement as HTMLElement).click();
  }

  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.instance.invitationStyle = this.invitationStyle;
    ref.instance.div = this.div;
    ref.instance.invitationName = this.invitationName;
    ref.instance.locale = this.locale;
    ref.instance.invitationSurname = this.invitationSurname;
    ref.changeDetectorRef.detectChanges();
  }
  startDialog(email: string) {
    this.userService.findUserByEmail(email).subscribe(user => {
      ProfileComponent.toggle(user)
    });
  }
}
