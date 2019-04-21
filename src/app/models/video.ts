import {BookedUser} from './bookedUser';
import {Comment} from './comment';

export class Video {
  url: string;
  safeUrl;
  votes1: BookedUser[];
  votes2: BookedUser[];
  fighter1: BookedUser;
  fighter2: BookedUser;
  votedForFirstFighter: boolean;
  votedForSecondFighter: boolean;
  comments: Comment[];
  style: string;
}
