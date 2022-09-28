import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {jwtConstants} from '../constants';
import {CommonMessage} from 'src/common/messages/messages.common';
import {UserService} from 'src/modules/users/users.service';
import {genTokenIdentifier} from '../../helper/common-gen-password';
import {UserStatus} from 'src/modules/users/users.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    if (!payload.userId) throw new UnauthorizedException(CommonMessage.invalidToken);

    const user = await this.userService.getById(payload.userId);

    if (
      !user ||
      payload.i !== genTokenIdentifier(user.password) ||
      user?.status !== UserStatus.ACTIVE
    )
      throw new UnauthorizedException(CommonMessage.invalidToken);

    return payload;
  }
}
