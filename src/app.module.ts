import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CommonLoggerModule} from './common/logger/common-logger.module';
import {typeOrmConfig} from './common/database/typeorm.config';
import {UserModule} from './modules/users/users.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';
import {AuthenticationModule} from './modules/authentication/auth.module';
import {RequestModule} from './modules/request/requests.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/api',
    }),
    CommonLoggerModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    RequestModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LogsMiddleware).forRoutes('*');
  // }
}
