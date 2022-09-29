import {ApiTags} from '@nestjs/swagger';
import {Controller} from '@nestjs/common';
import {UserService} from '../users.service';

@Controller('/staff/users')
@ApiTags('users')
export class UserStaffController {
  constructor(private readonly userService: UserService) {}
}
