import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserBaseDto} from './dto/user.dto';
import {UserRepository} from './users.repository';
import {UserEntity} from './entities/users.entity';
import {RegisterUserDto} from './dto/register.user.dto';
import {FindAllUsersDto} from './dto/list.users.dto';
import {ResponsePagination} from 'src/common/dto/pagination-response.dto';
import {UserMessage} from './message/user.message';
import {ChangePasswordDto} from './dto/change-password.dto';
import {generatePassword} from 'src/common/helper/common-gen-password';
import {MailService} from '../mail/mail.service';
import {UserRoles, UserStage, UserStatus} from './users.enum';
import {ForbiddenException} from '@nestjs/common/exceptions';
import {UpdateUserDto} from './dto/update.user.dto';
import {CreateUserDto} from './dto/create.user.dto';
import {RequestService} from '../request/requests.service';
import {DeleteResult} from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly mailService: MailService,
    private readonly requestService: RequestService,
  ) {}

  /**
   * register new user
   * @param registerDto RegisterUserDto
   * @returns UserBaseDto
   */
  async registerAccount(registerDto: RegisterUserDto): Promise<UserBaseDto> {
    const username = await this.repo.getUserByField('username', registerDto.username);
    const email = await this.repo.getUserByField('email', registerDto.email);
    if (email) {
      throw new ConflictException('Email already exist');
    }
    if (username) {
      throw new ConflictException('Username already exist');
    }
    if (registerDto.password != registerDto.confirmPassword) {
      throw new BadRequestException('Password mismatch');
    }

    const saltOrRounds = 10;
    // Hash the password
    const password = registerDto.password;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.repo.registerUser(registerDto, hashPassword);

    if (newUser) {
      await this.mailService.sendWelcomeMail(newUser.email, newUser.username);
    }

    return newUser;
  }

  /**
   * create new user
   * @param createDto CreateUserDto
   * @returns UserBaseDto
   */
  async createAccount(createDto: CreateUserDto, role: UserRoles) {
    const username = await this.repo.getUserByField('username', createDto.username);
    const email = await this.repo.getUserByField('email', createDto.email);
    if (username) {
      throw new ConflictException('Username already exist');
    }
    if (email) {
      throw new ConflictException('Email already exist');
    }
    // Hash the password
    const saltOrRounds = 10;
    const password = generatePassword();
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    if (role === UserRoles.ADMIN) {
      const newUser = await this.repo.createUser(createDto, hashPassword, UserRoles.STAFF);
      if (newUser) {
        await this.mailService.sendCreateMail(createDto.email, createDto.username, password);
      }
      return newUser;
    } else if (role === UserRoles.STAFF) {
      const newUser = await this.repo.createUser(createDto, hashPassword, UserRoles.USER);
      if (newUser) {
        await this.mailService.sendCreateMail(createDto.email, createDto.username, password);
      }
      return newUser;
    } else {
      throw new ForbiddenException('You have no rights to access !!!');
    }
  }

  async createAccountRequest(createDto: CreateUserDto) {
    const username = await this.repo.getUserByField('username', createDto.username);
    const email = await this.repo.getUserByField('email', createDto.email);
    if (username) {
      throw new ConflictException('Username already exist');
    }
    if (email) {
      throw new ConflictException('Email already exist');
    }

    return await this.repo.saveUser(
      createDto,
      UserRoles.USER,
      UserStatus.INACTIVE,
      UserStage.PENDING,
    );
  }

  // Make delete Account Request
  async deleteAccountRequest(id: string): Promise<DeleteResult> {
    await this.getById(id);

    return this.repo.deleteUser(id);
  }

  // Confirm Pending requests
  async acceptRequest(id: string): Promise<UserEntity> {
    const user = await this.getById(id);

    const saltOrRounds = 10;
    const password = generatePassword();
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    await this.mailService.sendCreateMail(user.email, user.username, password);

    user.status = UserStatus.ACTIVE;
    user.password = hashPassword;
    user.confirmPassword = hashPassword;
    user.stage = UserStage.APPROVED;
    return user.save();
  }

  /**
   * Get all users
   * @param filterDto
   * @returns
   */
  async getAll(
    filterDto: FindAllUsersDto,
    role: UserRoles,
  ): Promise<ResponsePagination<UserEntity>> {
    return this.repo.getAllUsers(filterDto, role);
  }

  async getPendingUsers(filterDto: FindAllUsersDto): Promise<ResponsePagination<UserEntity>> {
    return this.repo.getPendingUsers(filterDto);
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.repo.getUserById(id);

    if (!user) {
      throw new NotFoundException(UserMessage.notFound);
    }

    return user;
  }

  /**
   * Get user
   * @param field 'username' | 'email' | 'phone' | 'tabletId'
   * @param fieldData string
   * @param dupId string
   * @returns
   */
  async getUserByField(
    field: 'username' | 'email' | 'phone' | 'role',
    fieldData: string,
    dupId: string = null,
  ): Promise<UserEntity> {
    return await this.repo.getUserByField(field, fieldData, dupId);
  }

  /**
   * Send new password to user email
   * @param email string
   */
  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.repo.getUserByField('email', email);

    if (!user) {
      throw new NotFoundException(UserMessage.notFound);
    }

    try {
      const newPassword = generatePassword();

      // Hash the password
      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(newPassword, saltOrRounds);

      user.password = hashPassword;
      user.confirmPassword = hashPassword;
      await user.save();

      await this.mailService.sendForgotPasswordMail(user, newPassword);
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * User change password
   * @param passDto string
   */
  async changePassword(passDto: ChangePasswordDto, userId: string): Promise<boolean> {
    const user = await this.repo.getUserById(userId);

    try {
      const isMatch = await bcrypt.compare(passDto.oldPass, user.password);

      if (!isMatch) {
        throw new BadRequestException('Password mismatch');
      }

      if (passDto.newPass != passDto.confirmNewPass) {
        throw new BadRequestException('Password mismatch');
      }

      // Hash the password
      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(passDto.newPass, saltOrRounds);

      await this.repo.changePassword(user, hashPassword);

      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param id: string
   * @param updateDto: UpdateUserDto
   * @return boolean
   */
  async selfUpdate(id: string, updateDto: UpdateUserDto): Promise<boolean> {
    const user = await this.getById(id);

    try {
      await this.repo.updateUser(user, updateDto);
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param role: UserRoles
   * @param updateDto: UpdateUserDto
   * @return boolean
   */
  async updateAccount(id: string, role: UserRoles, updateDto: UpdateUserDto): Promise<boolean> {
    const user = await this.getById(id);

    if (role === UserRoles.ADMIN && user.role === UserRoles.STAFF) {
      await this.repo.updateUser(user, updateDto);
      return true;
    } else if (role === UserRoles.STAFF && user.role === UserRoles.USER) {
      await this.repo.updateUser(user, updateDto);
      return true;
    } else {
      throw new ForbiddenException('You have no rights to access !!!');
    }
  }

  async updateUserStatus(id: string, role: UserRoles): Promise<boolean> {
    const user = await this.getById(id);

    let success = false;

    if (role === UserRoles.ADMIN && user.role === UserRoles.STAFF) {
      if (user.status === UserStatus.ACTIVE) {
        const updated = await this.repo.updateUserStatus(user, UserStatus.INACTIVE);
        if (updated) {
          success = true;
        }
      } else {
        const updated = await this.repo.updateUserStatus(user, UserStatus.ACTIVE);
        if (updated) {
          success = true;
        }
      }
    } else if (role === UserRoles.STAFF && user.role === UserRoles.USER) {
      if (user.status === UserStatus.ACTIVE) {
        const updated = await this.repo.updateUserStatus(user, UserStatus.INACTIVE);
        if (updated) {
          success = true;
        }
      } else {
        const updated = await this.repo.updateUserStatus(user, UserStatus.ACTIVE);
        if (updated) {
          success = true;
        }
      }
    } else {
      throw new ForbiddenException('You have no rights to access !!!');
    }

    return success;
  }

  async deleteAccount(id: string, role: UserRoles): Promise<boolean> {
    const user = await this.getById(id);

    if (role === UserRoles.ADMIN && user.role === UserRoles.STAFF) {
      await this.repo.updateUserStatus(user, UserStatus.INACTIVE);
      return true;
    } else if (role === UserRoles.STAFF && user.role === UserRoles.USER) {
      await this.repo.updateUserStatus(user, UserStatus.INACTIVE);
      return true;
    } else {
      throw new ForbiddenException('You have no rights to access !!!');
    }
  }

  /**
   * Get user by username and password
   * @param username
   * @param passport
   * @returns
   */
  async getUserbyUserNamePass(username: string, passport: string): Promise<UserEntity> {
    let result: UserEntity;
    if (username && passport) {
      result = await this.repo.getUserByUserNamePass(username, passport);
    }
    return result;
  }
}
