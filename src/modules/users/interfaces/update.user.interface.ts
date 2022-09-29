import {IUserBase} from './user.interface';

export type IUpdateUser = Pick<
  IUserBase,
  | 'id'
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
