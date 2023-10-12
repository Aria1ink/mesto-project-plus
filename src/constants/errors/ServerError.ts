import { errorCode } from './errorCode';

export default class ServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errorCode.serverDefault;
  }
}
