import {Module, forwardRef} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from './constants';
import {LocalStrategy} from './strategies/local.strategy';
import {JwtStrategy} from './strategies/jwt.strategy';
import {UserModule} from 'src/modules/users/users.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
