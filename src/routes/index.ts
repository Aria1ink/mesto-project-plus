import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import routerAuth from './auth';
import routerCards from './cards';
import routerUsers from './users';
import NotFoundError from '../constants/errors/NotFoundError';

const router = Router();

router.use('/', routerAuth);
router.use('/', routerUsers);
router.use('/', routerCards);
router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Page not found'));
});

export default router;
