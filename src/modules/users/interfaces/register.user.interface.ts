import {IUserBase} from './user.interface';

export type IRegisterUser = Pick<
  IUserBase,
  'username' | 'password' | 'confirmPassword' | 'email' | 'phone' | 'address'
>;
