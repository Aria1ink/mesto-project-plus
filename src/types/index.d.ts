export {};

/* eslint-disable */
declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
      };
    }
    }
}
