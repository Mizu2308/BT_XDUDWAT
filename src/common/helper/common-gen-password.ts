import * as crypto from 'crypto';

export const generatePassword = (len = 6): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';

  const rb = crypto.randomBytes(len);

  for (let i = 0; i < len; i++) {
    rb[i] = rb[i] % chars.length;
    password += chars[rb[i]];
  }

  return password;
};

export const genTokenIdentifier = (userPassword: string) => {
  return crypto
    .createHash('sha512')
    .update(Buffer.from(userPassword, 'utf8').toString('base64'))
    .digest('hex');
};
