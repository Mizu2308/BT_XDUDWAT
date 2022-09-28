import {UserRoles} from 'src/modules/users/users.enum';

export interface UserInfo {
  userId: string;
  role: UserRoles;
}
