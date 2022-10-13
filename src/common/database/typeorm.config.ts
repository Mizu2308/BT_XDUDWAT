import {TypeOrmModule} from '@nestjs/typeorm';
import {databaseConfig} from 'configs/configs.constants';

export const typeOrmConfig: TypeOrmModule = {
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [`${__dirname}/../../**/*.entity.{js,ts}`],
  synchronize: databaseConfig.synchronize,
  logging: ['error'],
};
