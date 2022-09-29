import {UserRoles} from 'src/modules/users/users.enum';

export interface IRequestBase {
  id?: string;
  staffId?: string;
  body?: string;
  method?: string;
  creatorRole: UserRoles;
  createdAt?: Date;
  updatedAt?: Date;
}
