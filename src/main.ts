import {NestFactory} from '@nestjs/core';
import {PORT} from 'configs/configs.constants';
import {AppModule} from './app.module';
import {initializeApp, initializeSwagger} from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  initializeApp(app);
  initializeSwagger(app);

  await app.listen(PORT);
}

bootstrap();
