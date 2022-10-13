import {ApiProperty} from '@nestjs/swagger';
import {UserRoles, UserStatus} from '../users.enum';
import {IUserBase} from '../interfaces/user.interface';
import {
  Allow,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserBaseDto implements IUserBase {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'User name',
    type: String,
    example: 'username123',
  })
  @Allow()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'Abc@123456',
  })
  @Allow()
  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty({
    description: 'confirm_password',
    type: String,
    example: '123456',
  })
  @Allow()
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    type: String,
    example: 'username123@gmail.com',
  })
  @Allow()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '0999999999',
    required: false,
  })
  @Allow()
  @IsPhoneNumber('VN')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Allow()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Allow()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Allow()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Allow()
  @IsOptional()
  identity?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Allow()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    example: '0999999999',
    required: false,
  })
  @Allow()
  @IsOptional()
  surveyPrice?: number;

  @ApiProperty({
    type: String,
    example: '0999999999',
    required: false,
  })
  @Allow()
  @IsOptional()
  numberSurvey?: number;

  @ApiProperty({
    type: String,
    example: '0999999999',
    required: false,
  })
  @Allow()
  @IsOptional()
  questionSurvey?: number;

  @ApiProperty({
    type: String,
    example: UserRoles.USER,
    required: true,
  })
  @Allow()
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty({
    type: String,
    example: UserStatus.ACTIVE,
    required: true,
  })
  @Allow()
  @IsEnum(UserStatus)
  status: UserStatus;

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
