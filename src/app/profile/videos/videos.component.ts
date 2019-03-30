import {Component} from '@angular/core';
import {UserService} from '../../services/userService';
import {Video} from '../../models/video';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'videos-component',
  templateUrl: './videos.component.html'
})
export class VideosComponent {
  videos: Video[];
  constructor(private userService: UserService,
              private sanitizer: DomSanitizer) {}
  ngOnInit() {
    this.userService.getVideos().subscribe((videos: Video[]) => {
      this.videos = videos;
      for (let video of this.videos) {
        video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.facebook.com/plugins/video.php?href=' + video.url);
      }
    });
  }
}
