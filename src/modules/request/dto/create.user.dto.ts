import {PickType} from '@nestjs/swagger';
import {ICreateRequest} from '../intefaces/create.user.interface';
import {RequestBaseDto} from './requests.dto';

export class CreateRequestDto
  extends PickType(RequestBaseDto, ['body', 'method', 'creatorRole'] as const)
  implements ICreateRequest {}
