import {Component, ComponentFactoryResolver, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/userService';
import {Invite} from '../../models/invite';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'fights-component',
  templateUrl: './fights.component.html'
})
export class FightsComponent {
  invites: Invite[] = [];
  div;
  fighterInviter;
  fighterInvited;
  style;
  @ViewChild('file') file: ElementRef;
  inviteId;

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.userService.getPlannedFights(localStorage.getItem('email')).subscribe(invites => this.invites = invites);
  }

  showPlace(coordinateX, coordinateY) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.latitude = coordinateX;
    ref.instance.longitude = coordinateY;
    ref.instance.userMarkers = [];
    ref.instance.userMarkers.push({latitude: coordinateX, longitude: coordinateY});
    ref.changeDetectorRef.detectChanges();
  }

  onFileChange(event) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (file.type === 'video/mp4') {
      this.userService.uploadVideo(file, this.fighterInviter, this.fighterInvited, this.inviteId, this.style).subscribe(result => {
        this.userService.getPlannedFights(localStorage.getItem('email')).subscribe(invites => this.invites = invites);
        if (result === 'success') {
          alert('Successfully')
        } else {
          alert('Ooops something went wrong please contact with administrator (Sergey)')
        }
      })
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
}
