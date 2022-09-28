import {Injectable, BadRequestException} from '@nestjs/common';
import {UserService} from '../users/users.service';
import {LoginDto} from './dto/auth.dto';
import {UserStatus} from '../users/users.enum';
import {AuthService} from 'src/common/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  /**
   * Login user
   * @param loginDto: LoginDto
   * @returns UserBaseDto
   */
  async login(loginDto: LoginDto) {
    // Check username and pass exist
    const userExist = await this.userService.getUserByField('username', loginDto.username);
    const isMatch = await bcrypt.compare(loginDto.password, userExist.password);

    if (!userExist || !isMatch) {
      throw new BadRequestException('Wrong username or password');
    }

    if (userExist.status === UserStatus.INACTIVE) {
      throw new BadRequestException('User is inactive');
    }

    // if (userByUserName.role === UserRoles.USER || userByUserName.role === UserRoles.TABLET){
    //   throw new ForbiddenException();
    // }
    const {password, ...user} = userExist;
    // Get info: userId, roomId, facilitiesId, Role
    const accessTokenObject = await this.authService.login(userExist.id, userExist.role, password);
    return {
      ...accessTokenObject,
      user,
    };
  }
}
