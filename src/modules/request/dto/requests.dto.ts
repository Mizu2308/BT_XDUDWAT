import {ApiProperty} from '@nestjs/swagger';
import {Allow, IsDateString, IsEnum, IsOptional, IsString} from 'class-validator';
import {UserRoles} from 'src/modules/users/users.enum';
import {IRequestBase} from '../intefaces/requests.interface';
import {RequestMethod} from '../requests.enum';

export class RequestBaseDto implements IRequestBase {
  @ApiProperty({
    description: 'body',
    type: String,
  })
  @Allow()
  @IsString()
  body?: string;

  @ApiProperty({
    example: RequestMethod.GET,
    type: String,
  })
  @Allow()
  @IsEnum(RequestMethod)
  method?: RequestMethod;

  @ApiProperty({
    type: String,
    example: UserRoles.USER,
    required: true,
  })
  @Allow()
  @IsEnum(UserRoles)
  creatorRole: UserRoles;

  @ApiProperty({
    type: Date,
    example: '2022-08-04T03:30:09.258Z',
    required: false,
  })
  @Allow()
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @ApiProperty({
    type: Date,
    example: '2022-08-04T03:30:09.258Z',
    required: false,
  })
  @Allow()
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
