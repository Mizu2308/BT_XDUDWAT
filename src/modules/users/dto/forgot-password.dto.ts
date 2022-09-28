import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString} from 'class-validator';

export class ForgotPassResDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  success: boolean;
}

export class ForgotPassDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'admin@example.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;
}

export class ValidateTokenDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '',
    description: 'Reset password token',
  })
  @IsString()
  token: string;
}

export class ValidateTokenResDto {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  valid: boolean;
}
