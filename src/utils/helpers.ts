import User from '@models/User';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

export function signJWT(user: InstanceType<typeof User>) {
  const payload = {
    id: user._id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function generateRandomString(length = 8) {
  let result = '';
  while (result.length < length) {
    result += uuid().replace(/-/g, '');
  }

  return result.substring(0, length);
}
