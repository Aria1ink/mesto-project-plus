import { errorCode } from './errorCode';

export default class UserExistsError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errorCode.conflict;
  }
}
