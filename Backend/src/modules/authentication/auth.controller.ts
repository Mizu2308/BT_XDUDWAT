import {ApiBody, ApiCreatedResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Controller, Post, Body, ValidationPipe} from '@nestjs/common';
import {LoginDto} from './dto/auth.dto';
import {AuthenticationService} from './auth.service';
import {UserBaseDto} from '../users/dto/user.dto';
import {RegisterUserDto} from '../users/dto/register.user.dto';
import {UserService} from '../users/users.service';
import {ForgotPassDto, ForgotPassResDto} from '../users/dto/forgot-password.dto';

@ApiTags('authentication')
@Controller('/auth')
export class LoginController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  @ApiOperation({
    operationId: 'register-account',
    description: `
      POST /
      {
        "username": "fmanQTI",
        "password": "12345678",
        "confirmPassword": "12345678",
        "email": "fman@qti.com",
        "phone": "0999999999",
        "address": "123 Main St"
      }
    `,
    summary: 'register account',
  })
  @ApiCreatedResponse({description: 'OK', type: UserBaseDto})
  @ApiBody({type: RegisterUserDto})
  async create(@Body(ValidationPipe) registerUserDto: RegisterUserDto): Promise<UserBaseDto> {
    return this.userService.registerAccount(registerUserDto);
  }

  @Post('/login')
  @ApiOperation({
    operationId: 'login-account',
    description: `
      POST /
      {
        "username": "user1",
        "password": "123456",
      }
    `,
    summary: 'login account',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post('/forgot_password')
  @ApiOperation({
    operationId: 'forgot_password',
    description: `
      POST /
      {
        "email": "abc@gmail.com"
      }
    `,
    summary: 'forgot account',
  })
  async forgotPassword(@Body(ValidationPipe) {email}: ForgotPassDto): Promise<ForgotPassResDto> {
    const success = await this.userService.forgotPassword(email);
    return {success};
  }
}
