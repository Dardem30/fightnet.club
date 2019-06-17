import {BookedUser} from './bookedUser';

export class User {
  username: string;
  email: string;
  password: string;
  weight: string;
  growth: string;
  preferredKind: string;
  name: string;
  surname: string;
  description: string;
  timezone: string;
  country: string;
  city: string;
  bookedUsers: BookedUser[];
  roles;
  isAdmin;
  wins;
  loses;
  photos: string[];
  mainPhoto: string;
  notifications: number;
  unreadedMessages: number;
}
