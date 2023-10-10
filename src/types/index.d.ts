/* eslint-disable */
// не нужен тут  экспорт
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string | JwtPayload;
      };
    }
  }
}
/* eslint-enable */
