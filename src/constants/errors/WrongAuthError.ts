import { errorCode } from './errorCode';

export default class WrongAuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errorCode.unauthorized;
  }
}
