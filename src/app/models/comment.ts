import {Video} from './video';

export class Comment {
  text: string;
  email: string;
  userFullName: string;
  emails: string[] = [];
  date: Date;
  photo: string;
  isYou: boolean;
  video: Video;
}
