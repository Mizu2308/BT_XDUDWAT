import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
    description: 'Old password',
  })
  @IsString()
  oldPass: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123abc',
    description: 'New password',
  })
  @IsString()
  newPass: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
    description: 'Old password',
  })
  @IsString()
  confirmNewPass: string;
}
