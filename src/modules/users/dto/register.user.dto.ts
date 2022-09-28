import {UserBaseDto} from './user.dto';
import {PickType} from '@nestjs/swagger';
import {IRegisterUser} from '../interfaces/register.user.interface';

export class RegisterUserDto
  extends PickType(UserBaseDto, [
    'username',
    'password',
    'confirmPassword',
    'email',
    'phone',
    'address',
  ] as const)
  implements IRegisterUser {}
