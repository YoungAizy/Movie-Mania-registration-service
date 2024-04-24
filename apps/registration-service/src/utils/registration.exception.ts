import { HttpException } from '@nestjs/common';

export class RegistrationException extends HttpException {
  constructor(msg: string, statusCode: number, error?: string) {
    super(msg, statusCode, { cause: error });
  }
}
