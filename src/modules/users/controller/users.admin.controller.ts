import {ApiTags} from '@nestjs/swagger';
import {Controller} from '@nestjs/common';
import {UserService} from '../users.service';
@Controller('admin/users')
@ApiTags('users')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}
}
