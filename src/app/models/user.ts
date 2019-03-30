import {BookedUser} from './bookedUser';

export class User {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  description: string;
  timezone: string;
  country: string;
  city: string;
  bookedUsers: BookedUser[];
  roles;
  isAdmin;
}
