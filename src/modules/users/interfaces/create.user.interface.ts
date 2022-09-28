import {IUserBase} from './user.interface';

export type ICreateUser = Pick<
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
