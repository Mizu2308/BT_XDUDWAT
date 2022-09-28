import {UserBaseDto} from './user.dto';
import {ApiProperty, PickType} from '@nestjs/swagger';
import {IUpdateUser} from '../interfaces/update.user.interface';

export class UpdateUserDto
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
  implements IUpdateUser {}

export class UpdateResDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  success: boolean;
}
