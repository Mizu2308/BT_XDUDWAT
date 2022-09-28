import {join} from 'path';
import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {MailerModule} from '@nestjs-modules/mailer';
import {mailConfig} from '../../../configs/configs.constants';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: mailConfig.host,
          secure: false,
          auth: {
            user: mailConfig.user,
            pass: mailConfig.password,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${mailConfig.from}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
