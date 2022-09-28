import {UserRoles, UserStatus} from '../users.enum';

export interface IUserBase {
  id?: string;
  username: string;
  name?: string;
  identity?: number;
  description?: string;
  surveyPrice?: number;
  numberSurvey?: number;
  questionSurvey?: number;
  password: string;
  confirmPassword: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRoles;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
