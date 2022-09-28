import {Inject, Injectable, forwardRef} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from 'src/modules/users/users.service';
import {genTokenIdentifier} from '../helper/common-gen-password';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  /**
   * Validate Account
   * @param username
   * @param password
   * @returns
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserbyUserNamePass(username, password);
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * Generate token
   * @param userid
   * @param role
   * @param password
   * @returns
   */
  async login(userid: string, role: string, password: string) {
    const payload = {
      userId: userid,
      role: role,
      i: genTokenIdentifier(password),
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
