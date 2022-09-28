import {IUserBase} from './user.interface';

export type IUpdateUser = Pick<
  IUserBase,
  | 'id'
  | 'username'
  | 'email'
  | 'phone'
  | 'address'
  | 'firstName'
  | 'lastName'
  | 'identity'
  | 'description'
  | 'surveyPrice'
  | 'numberSurvey'
  | 'questionSurvey'
>;
