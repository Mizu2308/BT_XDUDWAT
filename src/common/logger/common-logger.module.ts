import {Module} from '@nestjs/common';
import {CommonLoggerService} from './common-logger.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CommonLoggerService],
  exports: [CommonLoggerService],
})
export class CommonLoggerModule {}
