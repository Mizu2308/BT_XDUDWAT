import {UserRoles} from '../users.enum';

export class UserMessage {
  static notFound = `User Not Found`;
  static mustUnique = (key: string, field: string) => `${key}:${field} must be unique`;
  static forbiddenChangeStatus = (role1: UserRoles, role2: UserRoles) =>
    `${role1} is forbidden to change ${role2} status`;
  static forbiddenCU = (role1: UserRoles, role2: UserRoles, action: 'create' | 'update') =>
    `${role1} is forbidden to ${action} ${role2}`;
  static missingFacilityName = `facilityName is required when creating a FACILITY_MANAGER`;
  static mustUUID = 'UserId Must Be UUID';
  static missingFacilityId = `facilityId is required when creating a TABLET user`;
  static incorrectPassword = `Incorrect password`;
  static incorrectUserNamePassword = `username or password is incorrect`;
}
