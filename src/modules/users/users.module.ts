import {Module, forwardRef} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entities/users.entity';
import {UserStaffController} from './controller/users.staff.controller';
import {UserRepository} from './users.repository';
import {UserService} from './users.service';
import {UserController} from './controller/users.controller';
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from 'src/common/auth/constants';
import {UserAdminController} from './controller/users.admin.controller';
import {MailModule} from '../mail/mail.module';
import {RequestModule} from '../request/requests.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
    MailModule,
    RequestModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserAdminController, UserController, UserStaffController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
