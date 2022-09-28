export const jwtConstants = {
  secret: process.env.AUTH_JWT_SECRET || 'QTI_SecretKey',
  expiresIn: process.env.AUTH_JWT_EXPIRES || '86400s',
};

export const IS_PUBLIC_KEY = 'isPublic';
