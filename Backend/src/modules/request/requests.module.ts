import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RequestEntity} from './entities/request.entity';
import {RequestController} from './requests.controller';
import {RequestRepository} from './requests.repository';
import {RequestService} from './requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity])],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [RequestService, RequestRepository],
})
export class RequestModule {}
