import {Component, ComponentFactoryResolver, HostListener, Input} from '@angular/core';
import {Video} from "../models/video";
import {UserService} from "../services/userService";
import {DomSanitizer} from "@angular/platform-browser";
import {BookedUser} from "../models/bookedUser";
import {UserProfileComponent} from "../profile/seeProfile/userProfile.component";
import * as enLocalization from 'src/localization/fightnet.en';
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {Comment} from "../models/comment";
import {AppComponent} from "../app.component";
import {SocketService} from "../services/socketService";


@Component({
  selector: 'mobile-videos-component',
  templateUrl: './mobileVideos.component.html'
})
export class MobileVideosComponent {
  private serverUrl = AppComponent.apiEndpoint + 'socket';
  page = 1;
  isSearching: boolean = true;
  collectionSize = 0;
  invitationStyle;
  stompClientComments;
  locale = enLocalization;
  invitationName;
  invitationSurname;
  videos: Video[];
  model: any = {};
  div;
  socketConnectionIsOpenComments = false;
  showComments;
  comments: Comment[];
  @Input() textComment = '';
  videoId;
  commentsToShow: Comment[] = [];
  user;
  accessTokenFacebook;
  open = true;
  heightChecked = false;
  initHeight = 0;
  constructor(private userService: UserService,
              private sanitizer: DomSanitizer,
              private componentFactoryResolver: ComponentFactoryResolver,
              private socketService: SocketService) {
  }

  ngOnInit() {
    console.log(localStorage.getItem('mobileUser'));
    this.user = JSON.parse(localStorage.getItem('mobileUser'));
   // this.accessTokenFacebook = this.user.accessTokenFacebook;
    this.accessTokenFacebook = this.user.accessTokenFacebook;
    this.search();
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.stompClientComments != null) {
      this.stompClientComments.disconnect();
    }
  }

  closeComments() {
    this.stompClientComments.disconnect();
    this.socketConnectionIsOpenComments = false;
    this.showComments = false;
  }
  toggleCommentsDialog(video: Video) {
    console.log(video);
    if (this.stompClientComments != null) {
      this.stompClientComments.disconnect();
    }
    this.socketConnectionIsOpenComments = false;
    this.comments = video.comments;
    this.videoId = video.url;
    this.showComments = true;
  }
  initializeWebSocketConnectionForComments() {
    let ws = new SockJS(this.serverUrl);
    this.stompClientComments = Stomp.over(ws);
    let that = this;
    this.stompClientComments.connect({
      'Authorization': this.user.token
    }, function () {
      that.openCommentsSocket();
    });
  }
  sendComment() {
    if (this.textComment != null && this.textComment != '') {
      const video: Video = new Video();
      const comment: Comment = new Comment();
      video.url = this.videoId;
      comment.text = this.textComment;
      comment.email = this.user.email;
      comment.photo = this.user.mainPhoto;
      comment.video = video;
      comment.userFullName = this.user.name + ' ' + this.user.surname;
      for (let uComment of this.commentsToShow) {
        comment.emails.push(uComment.email);
      }
      this.textComment = '';
      this.socketService.postComment(comment).subscribe();
    }
  }

  openCommentsSocket() {
    this.stompClientComments.subscribe('/socket-publisher/' + this.videoId, (commentJson) => {
      const comment = JSON.parse(commentJson.body);
      if (comment.email = this.user.email) {
        comment.email = null;
        comment.photo = this.user.mainPhoto;
        comment.isYou = true;
      }
      this.commentsToShow.push(comment)
    });
  }
  checkOpenComments() {
    if (this.showComments == true && this.socketConnectionIsOpenComments == false) {
      this.socketConnectionIsOpenComments = true;
      this.commentsToShow = this.comments == null ? [] : this.comments;
      const emails = [];
      for (const com of this.commentsToShow) {
        if (emails.indexOf(com.email) == -1) {
          emails.push(com.email);
        }
        if (com.email == this.user.email) {
          com.email = null;
          com.photo = this.user.mainPhoto;
          com.isYou = true;
        }
      }
      this.userService.getCommentsPhotos(emails).subscribe(result => {
        for (const com of this.commentsToShow) {
          if (com.email != null) {
            com.photo = result[com.email];
          }
        }
      });
      this.initializeWebSocketConnectionForComments();
    }
    return this.showComments;
  }
  slideToggle(el: string) {
    const chat = el == 'comments' ? document.getElementById('chatComments') : document.getElementById('chat');
    if (!this.heightChecked) {
      this.initHeight = chat.offsetHeight;
      this.heightChecked = true;
    }
    if (this.open) {
      this.open = false;
      chat.style.height = '0px';
    }
    else {
      this.open = true;
      chat.style.height = this.initHeight + 'px';
    }
  }
  voteForFighter1(video: Video) {
    if (video.votedForFirstFighter == true) {
      video.votedForFirstFighter = null;
      const index: number = video.votes1.map(function (user) {
        return user.email;
      }).indexOf(this.user.email);
      if (index !== -1) {
        video.votes1.splice(index, 1);
      }
    } else {

      video.votedForFirstFighter = true;
      let user: BookedUser = new BookedUser();
      user.email = this.user.email;
      video.votes1.push(user);
    }
    if (video.votedForSecondFighter == true) {
      video.votedForSecondFighter = null;
      const index: number = video.votes2.map(function (user) {
        return user.email;
      }).indexOf(this.user.email);
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
      }).indexOf(this.user.email);
      if (index !== -1) {
        video.votes2.splice(index, 1);
      }
    } else {
      video.votedForSecondFighter = true;
      let user: BookedUser = new BookedUser();
      user.email = this.user.email;
      video.votes2.push(user);
    }
    if (video.votedForFirstFighter == true) {
      video.votedForFirstFighter = null;
      const index: number = video.votes1.map(function (user) {
        return user.email;
      }).indexOf(this.user.email);
      if (index !== -1) {
        video.votes1.splice(index, 1);
      }
    }
    this.userService.updateVideo(video);
  }

  search() {
    this.isSearching = true;
    this.model.pageNum = this.page;
    this.userService.searchVideo(this.model).subscribe(videos => {
      this.collectionSize = videos.count;
      this.videos = videos.records;
      for (let video of this.videos) {
        video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.facebook.com/plugins/video.php?href=' + video.url + '/');
        if (video.votes1 != null) {
          for (let user of video.votes1) {
            if (user.email == this.user.email) {
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
              if (user.email == this.user.email) {
                video.votedForSecondFighter = true;
                break;
              }
            }
          }
        } else {
          video.votes2 = [];
        }
      }
      this.isSearching = false;
    });
  }
  showProfile(email: string) {
    this.div.remove(1);
    let factory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    let ref = this.div.createComponent(factory);
    ref.instance.email = email;
    ref.instance.invitationStyle = this.invitationStyle;
    ref.instance.locale = this.locale;
    ref.instance.div = this.div;
    ref.instance.invitationName = this.invitationName;
    ref.instance.invitationSurname = this.invitationSurname;
    ref.changeDetectorRef.detectChanges();
  }
}
