import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsNotEmpty} from 'class-validator';

export class BaseDeleteResDTO {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsBoolean()
  deleted: boolean;
}
