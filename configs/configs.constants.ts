import {config} from 'dotenv';
config();

// export env
export const PORT = process.env.PORT || 3000;
export const SERVICE_NAME = process.env.SERVICE_NAME || 'service_name';

export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'debug';
export const LOGGER_SILENT = process.env.LOGGER_SILENT || 'true';

export const SWAGGER_CF = {
  url: process.env.SWAGGER_URL || 'docs/api',
  title: process.env.SWAGGER_TITLE || 'base_title',
  description: process.env.SWAGGER_DESCRIPTION || 'base_description',
  version: process.env.SWAGGER_VERSION || '1.0.0',
  tag: process.env.SWAGGER_TAG || 'base_tag',
  addBearerAuth: {
    description:
      process.env.SWAGGER_BEARERAUTH_DESCRIPTION ||
      '[just text field] Please enter token in following format: Bearer <JWT>',
    // types: process.env.SWAGGER_BEARERAUTH_TYPE || 'http',
    name: process.env.SWAGGER_BEARERAUTH_NAME || 'Authorization',
    in: process.env.SWAGGER_BEARERAUTH_IN || 'Header',
    bearerFormat: process.env.SWAGGER_BEARERAUTH_BEARERFORMAT || 'Bearer',
    scheme: process.env.SWAGGER_BEARERAUTH_SCHEME || 'Bearer',
  },
  accessToken: process.env.SWAGGER_ACCESSTOKEN || 'accessToken',
};

export const AUTH_JWT_CF = {
  secret: process.env.AUTH_JWT_SECRET || 'SECRET_JWT',
  expiresIn: process.env.AUTH_JWT_EXPIRES || 10 * 60 * 60 * 24,
};

export const databaseConfig = {
  type: process.env.DB_TYPE,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  synchronize: process.env.DB_SYNCHRONIZE,
};

export const fileUploadConfig = {
  fileLimit: parseInt(process.env.FILE_MAX_SIZE) || 10000000, // Compliant: 10MB
};

export const mailConfig = {
  host: process.env.MAIL_HOST,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
  resetUrl: process.env.MAIL_RESET_URL,
};

export const TIME_ZONE_DEFAULT = process.env.TIME_ZONE_DEFAULT || `Asia/Tokyo`;
