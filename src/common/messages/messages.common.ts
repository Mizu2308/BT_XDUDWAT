export class CommonMessage {
  static invalidCredentials = `Invalid credentials`;
  static invalidToken = `Invalid token`;
  static alreadyExists = (key, field) => `${key}:${field} already exists`;
  static mustUnique = (key, field) => `${key}:${field} must be unique`;
  static notEmpty = (key, field) => `${key}:${field} is not empty`;
  static maxLength = (key, field, maxLength) =>
    `${key}:${field} must be shorter than or equal to ${maxLength} characters`;
  static notCorrect = (key, field) => `${key}:${field} is not correct`;
}
