import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsUUID} from 'class-validator';

export class UuidReqDTO {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
