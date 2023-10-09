import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

/* eslint-disable */
// не нужен тут дефолтный экспорт
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
