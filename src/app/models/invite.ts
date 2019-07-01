import {BookedUser} from './bookedUser';

export class Invite {
  id;
  fighterInviter: BookedUser;
  fighterInvited: BookedUser;
  latitude;
  longitude;
  fightStyle;
  date: Date;
  accepted;
  comment: string;
  constructor() {}
}
