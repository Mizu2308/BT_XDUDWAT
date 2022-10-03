import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';
import {UserEntity} from '../users/entities/users.entity';
import {MailSubject, MailTemplates} from './mail.enum';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPasswordMail(user: UserEntity, forgotPassword: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: MailSubject.FORGOT_PASSWORD,
      template: MailTemplates.FORGOT_PASSWORD,
      context: {
        name: user.username,
        password: forgotPassword,
      },
    });
  }

  async sendCreateMail(email: string, account: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: MailSubject.CREATE_ACCOUNT,
      template: MailTemplates.CREATE_ACCOUNT,
      context: {
        account: account,
        password: password,
      },
    });
  }

  async sendWelcomeMail(email: string, account: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: MailSubject.CREATE_ACCOUNT,
      template: MailTemplates.WELCOME,
      context: {
        account: account,
      },
    });
  }
}
