import {Get, Req, Body, Post, Query, UseGuards, Controller, ValidationPipe} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {ChangePasswordDto} from '../dto/change-password.dto';
import {ForgotPassResDto} from '../dto/forgot-password.dto';
import {UserService} from '../users.service';
import {UserEntity} from '../entities/users.entity';
import {FindAllUsersDto, FindAllUsersResDto} from '../dto/list.users.dto';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {JwtAuthGuard} from 'src/common/auth/guards/jwt-auth.guard';
import {SWAGGER_CF} from 'configs/configs.constants';
import {RolesGuard} from 'src/common/auth/guards/roles.guard';
import {UserInfo} from 'src/common/dto/reqUserInfo.Dto';
import {Delete, Param, Put} from '@nestjs/common/decorators';
import {ChangeStatusResDto} from '../dto/change-status.dto';
import {UserIdDTO} from '../dto/get-by-id.user.dto';
import {DeleteResDto, DeleteUserDto} from '../dto/delete.user.dto';
import {UserBaseDto} from '../dto/user.dto';
import {UpdateResDto, UpdateUserDto} from '../dto/update.user.dto';
import {RegisterUserDto} from '../dto/register.user.dto';
import {CreateUserDto} from '../dto/create.user.dto';
import {UuidReqDTO} from 'src/common/dto/uuid-req.dto';
import {UserStatus} from '../users.enum';

@Controller('/users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(SWAGGER_CF.accessToken)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({
    operationId: 'create-account',
    description: `
      POST /
      {
        "username": "fmanQTI",
        "email": "fman@qti.com",
      }
    `,
    summary: 'create account',
  })
  @ApiCreatedResponse({description: 'OK', type: UserBaseDto})
  @ApiBody({type: RegisterUserDto})
  async createAccount(
    @Body(ValidationPipe) createDto: CreateUserDto,
    @Req() req: {user: UserInfo},
  ) {
    return this.userService.createAccount(createDto, req.user.role);
  }

  @Post('/create_request')
  @ApiOperation({
    operationId: 'create_request',
    description: `
      POST /
      {
        "username": "fmanQTI",
        "email": "fman@qti.com",
      }
    `,
    summary: 'create_request',
  })
  @ApiCreatedResponse({description: 'OK'})
  @ApiBody({type: RegisterUserDto})
  async createAccountRequest(@Body(ValidationPipe) createDto: CreateUserDto, @Req() req) {
    return this.userService.createAccountRequest(createDto, req.user);
  }

  @Post('/delete_request')
  @ApiOperation({
    operationId: 'delete_request',
    description: `
      POST /
      {
        "id": "5b0b8bd2-aeaa-41f4-83ed-96f45c74cb52",
      }
    `,
    summary: 'delete_request',
  })
  @ApiCreatedResponse({description: 'OK'})
  @ApiBody({type: RegisterUserDto})
  async deleteAccountRequest(@Body(ValidationPipe) deleteDto: DeleteUserDto, @Req() req) {
    return this.userService.deleteAccountRequest(deleteDto, req.user);
  }

  @Post('/response/:id')
  @ApiOperation({
    operationId: 'response-staff-request',
    description: `
      POST /
    `,
    summary: 'response staff request',
  })
  @ApiCreatedResponse({description: 'OK'})
  async acceptRequest(@Param(ValidationPipe) {id}: UuidReqDTO) {
    const success = await this.userService.acceptRequest(id);
    return {success};
  }

  @Post('/change_password')
  @ApiOperation({
    operationId: 'change_password',
    description: `
      POST /
      {
        "oldPass": "123456",
        "newPass": "654321",
        "confirmNewPass": "654321"
      }
    `,
    summary: 'change_password',
  })
  async changePassword(
    @Body(ValidationPipe) passDto: ChangePasswordDto,
    @Req() req: {user: UserInfo},
  ): Promise<ForgotPassResDto> {
    const success = await this.userService.changePassword(passDto, req.user.userId);
    return {success};
  }

  @Get()
  @ApiOperation({
    operationId: 'get-all-users',
    description: `
      GET /
    `,
    summary: 'Get all Users',
  })
  @ApiOkResponse({description: 'OK', type: FindAllUsersResDto})
  async getAll(
    @Query() filterDto: FindAllUsersDto,
    @Req() req: {user: UserInfo},
  ): Promise<ResponsePagination<UserEntity>> {
    return this.userService.getAll(filterDto, req.user.role);
  }

  @Get('/other/:id')
  @ApiOperation({
    operationId: 'get-user',
    description: `
      GET /
    `,
    summary: 'Get User',
  })
  @ApiOkResponse({description: 'OK'})
  async getById(@Param(ValidationPipe) {id}: UserIdDTO): Promise<UserEntity> {
    return this.userService.getById(id);
  }

  @Get('/me')
  @ApiOperation({
    operationId: 'get-user',
    description: `
      GET /
    `,
    summary: 'Get User',
  })
  @ApiOkResponse({description: 'OK'})
  async getMe(@Req() req: {user: UserInfo}): Promise<UserEntity> {
    return this.userService.getById(req.user.userId);
  }

  @Put('/me')
  @ApiOperation({
    operationId: 'self-update',
    description: `
    Put /
    {
      "username": "user1",
      "email": "user1@example.com",
      "phone": "0911747399",
      "address": "123 Main Street"
    }
    `,
    summary: 'self update',
  })
  @ApiOkResponse({description: 'OK', type: UserBaseDto})
  async selfUpdate(
    @Body(ValidationPipe) updateDto: UpdateUserDto,
    @Req() req: {user: UserInfo},
  ): Promise<UpdateResDto> {
    const success = await this.userService.selfUpdate(req.user.userId, updateDto);
    return {success};
  }

  @Put('/other/:id')
  @ApiOperation({
    operationId: 'update-users',
    description: `
    Put /
    {
      "username": "user1",
      "email": "user1@example.com",
      "phone": "0911747399",
      "address": "123 Main Street"
    }
    `,
    summary: 'update Users',
  })
  @ApiOkResponse({description: 'OK', type: UserBaseDto})
  async updateAccount(
    @Param(ValidationPipe) {id}: UserIdDTO,
    @Body(ValidationPipe) updateDto: UpdateUserDto,
    @Req() req: {user: UserInfo},
  ): Promise<UpdateResDto> {
    const success = await this.userService.updateAccount(id, req.user.role, updateDto);
    return {success};
  }

  @Put('/status/:id')
  @ApiOperation({
    operationId: 'update-users',
    description: `
    Put /
    
    `,
    summary: 'update Users',
  })
  @ApiOkResponse({description: 'OK'})
  async updateUserStatus(
    @Param(ValidationPipe) {id}: UserIdDTO,
    @Req() req: {user: UserInfo},
  ): Promise<UpdateResDto> {
    const success = await this.userService.updateUserStatus(id, req.user.role);
    return {success};
  }

  @Delete('/:id')
  @ApiOperation({
    operationId: 'delete-users',
    description: `
    Delete /
    `,
    summary: 'Delete Users',
  })
  @ApiOkResponse({description: 'OK', type: ChangeStatusResDto})
  async deleteAccount(
    @Param(ValidationPipe) {id}: UserIdDTO,
    @Req() req: {user: UserInfo},
  ): Promise<DeleteResDto> {
    const success = await this.userService.deleteAccount(id, req.user.role);
    return {success};
  }
}
