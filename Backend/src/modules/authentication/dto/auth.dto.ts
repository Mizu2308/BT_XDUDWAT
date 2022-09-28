import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User Name',
    type: String,
    example: 'user1',
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: '123456',
  })
  @IsString()
  readonly password: string;
}
