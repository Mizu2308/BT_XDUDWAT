import {Module} from '@nestjs/common';
import {AuthenticationService} from './auth.service';
import {LoginController} from './auth.controller';
import {AuthModule} from 'src/common/auth/auth.module';
import {UserModule} from '../users/users.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [LoginController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
