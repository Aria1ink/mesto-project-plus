import { errorCode } from './errorCode';

export default class WrongDataError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = errorCode.badRequest;
  }
}
