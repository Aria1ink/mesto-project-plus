import { errorCode } from './errorCode';

export default class AccessDeniedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errorCode.forbidden;
  }
}
