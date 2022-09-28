import {UserBaseDto} from './user.dto';
import {ApiProperty, OmitType} from '@nestjs/swagger';
import {CommonPaginationDto} from 'src/common/dto/pagination.dto';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {UserRoles} from '../users.enum';
import {Allow, IsEnum} from 'class-validator';

export class FindAllUsersDto extends CommonPaginationDto {
  @ApiProperty({
    type: String,
    example: UserRoles.USER,
    required: true,
  })
  @Allow()
  @IsEnum(UserRoles)
  role: UserRoles;
}

export class FindAllUsersResDto extends OmitType(ResponsePagination, ['data'] as const) {
  @ApiProperty({type: [UserBaseDto]})
  data?: UserBaseDto[];
}
