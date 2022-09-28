import {ApiProperty} from '@nestjs/swagger';
import {BaseDeleteResDTO} from '../../../common/dto/base-delete-response.dto';
import {UserBaseDto} from './user.dto';
import {PickType} from '@nestjs/swagger';
import {IDeleteUser} from '../interfaces/delete.user.interface';

export class DeleteUserDto extends PickType(UserBaseDto, ['id'] as const) implements IDeleteUser {}

export class DeleteUserResDTO extends BaseDeleteResDTO {}

export class DeleteResDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  success: boolean;
}
