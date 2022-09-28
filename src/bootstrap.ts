import {INestApplication} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {SWAGGER_CF} from 'configs/configs.constants';

export const initializeApp = (app: INestApplication) => {
  app.enableCors();
};

export const initializeSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_CF.title)
    .setDescription(SWAGGER_CF.description)
    .setVersion(SWAGGER_CF.version)
    .addTag(SWAGGER_CF.tag)
    .addBearerAuth(
      {
        description: SWAGGER_CF.addBearerAuth.description,
        type: 'http',
        name: SWAGGER_CF.addBearerAuth.name,
        in: SWAGGER_CF.addBearerAuth.in,
        bearerFormat: SWAGGER_CF.addBearerAuth.bearerFormat,
        scheme: SWAGGER_CF.addBearerAuth.scheme,
      },
      SWAGGER_CF.accessToken,
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_CF.url, app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });
};
