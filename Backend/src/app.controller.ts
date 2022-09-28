import {Controller, Get, Query} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('zip-cloud')
  getZipCloud(@Query('zipcode') zipcode: string) {
    return this.appService.getZipCloud(zipcode);
  }
}
