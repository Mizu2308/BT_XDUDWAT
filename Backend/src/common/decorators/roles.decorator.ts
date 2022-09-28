import {SetMetadata} from '@nestjs/common';
import {UserRoles} from '../../modules/users/users.enum';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
