import {ApiProperty} from '@nestjs/swagger';
import {IsEnum} from 'class-validator';
import {UserStatus} from '../users.enum';

export class ChangeStatusResDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  updated: boolean;

  @ApiProperty({
    type: String,
    example: UserStatus.INACTIVE,
  })
  status?: UserStatus;
}

export class ChangeStatusDto {
  @ApiProperty({
    type: String,
    required: true,
    example: UserStatus.INACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
