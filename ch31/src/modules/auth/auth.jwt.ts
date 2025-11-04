// /src/modules/auth/auth.jwt.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { RefreshTokenPayload } from './auth.dto';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export const hashPassword = async (password: string): Promise<string> => {
  //$[algorithm version]$[cost]$[salt + hash]
  //예: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZag0Zk3JGVaBycKOq2ppFnpAOu42a
  //문자열은 해시된 패스워드이며, 그 안에 salt 값이 포함되어 있습니다.
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  //bcrypt는 내부적으로 hashedPassword 문자열 안에 들어있는 salt 값을 추출합니다.
  //그리고 그 salt로 다시 plainPassword를 해싱하여 비교합니다.
  return bcrypt.compare(password, hashedPassword);
};

export const createAccessToken = (payload: object): string => {
  console.log('Creating access token with payload:', payload);
  console.log('Using ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const createRefreshToken = (payload: object): string => {
  console.log('Creating refresh token with payload:', payload);
  console.log('Using REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET);

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    console.log('Error verifying access token:', error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    console.log('Verifying refresh token:', token);
    const decoded = jwt.decode(token, { complete: true });
    console.log('Decoded:', decoded);

    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    console.log('Error verifying refresh token:', error);
    return null;
  }
};
