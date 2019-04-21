import {Component} from '@angular/core';
import {UserService} from '../../services/userService';
import {Video} from '../../models/video';
import {DomSanitizer} from '@angular/platform-browser';
import {AppComponent} from '../../app.component';
import {BookedUser} from '../../models/bookedUser';
import {ProfileComponent} from '../profile.component';

@Component({
  selector: 'videos-component',
  templateUrl: './videos.component.html'
})
export class VideosComponent {
  videos: Video[];

  constructor(private userService: UserService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.userService.getVideos().subscribe((videos: Video[]) => {
      this.videos = videos;
      for (let video of this.videos) {
        video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.facebook.com/plugins/video.php?href=' + video.url + '/');
        if (video.votes1 != null) {
          for (let user of video.votes1) {
            if (user.email == localStorage.getItem('email')) {
              video.votedForFirstFighter = true;
              break;
            }
          }
        } else {
          video.votes1 = [];
        }
        if (video.votes2 != null) {
          if (video.votedForFirstFighter == null) {
            for (let user of video.votes2) {
              if (user.email == localStorage.getItem('email')) {
                video.votedForSecondFighter = true;
                break;
              }
            }
          }
        } else {
          video.votes2 = [];
        }
      }
    });
  }

  voteForFighter1(video: Video) {
    if (video.votedForFirstFighter == true) {
      video.votedForFirstFighter = null;
      const index: number = video.votes1.map(function (user) {
        return user.email;
      }).indexOf(localStorage.getItem('email'));
      if (index !== -1) {
        video.votes1.splice(index, 1);
      }
    } else {
      video.votedForFirstFighter = true;
      let user: BookedUser = new BookedUser();
      user.email = AppComponent.user.email
      video.votes1.push(user);
    }
    if (video.votedForSecondFighter == true) {
      video.votedForSecondFighter = null;
      const index: number = video.votes2.map(function (user) {
        return user.email;
      }).indexOf(localStorage.getItem('email'));
      if (index !== -1) {
        video.votes2.splice(index, 1);
      }
    }
    this.userService.updateVideo(video);
  }

  voteForFighter2(video: Video) {
    if (video.votedForSecondFighter == true) {
      video.votedForSecondFighter = null;
      const index: number = video.votes2.map(function (user) {
        return user.email;
      }).indexOf(localStorage.getItem('email'));
      if (index !== -1) {
        video.votes2.splice(index, 1);
      }
    } else {
      video.votedForSecondFighter = true;
      let user: BookedUser = new BookedUser();
      user.email = AppComponent.user.email;
      video.votes2.push(user);
    }
    if (video.votedForFirstFighter == true) {
      video.votedForFirstFighter = null;
      const index: number = video.votes1.map(function (user) {
        return user.email;
      }).indexOf(localStorage.getItem('email'));
      if (index !== -1) {
        video.votes1.splice(index, 1);
      }
    }
    this.userService.updateVideo(video);
  }
  comments(video: Video) {
    ProfileComponent.toggleCommentsDialog(video)
  }
}
