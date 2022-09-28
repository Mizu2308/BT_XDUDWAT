import {UserBaseDto} from './user.dto';
import {PickType} from '@nestjs/swagger';
import {ICreateUser} from '../interfaces/create.user.interface';

export class CreateUserDto
  extends PickType(UserBaseDto, [
    'id',
    'username',
    'email',
    'phone',
    'address',
    'name',
    'identity',
    'description',
    'surveyPrice',
    'numberSurvey',
    'questionSurvey',
  ] as const)
  implements ICreateUser {}
