import {IUserBase} from './user.interface';

export type IUpdateUser = Pick<
  IUserBase,
  | 'id'
  | 'username'
  | 'email'
  | 'phone'
  | 'address'
  | 'name'
  | 'identity'
  | 'description'
  | 'surveyPrice'
  | 'numberSurvey'
  | 'questionSurvey'
>;
