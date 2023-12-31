import { Response, Request, NextFunction } from 'express';

import { ValidateError } from 'tsoa';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '.';

export function exceptionHandler(
  err: unknown | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err) {
    console.error(err);
  }

  if (err instanceof ValidateError) {
    const fields = err?.fields;
    let message = '';

    for (const key in fields) {
      message = fields[key].message;
      break;
    }

    return res.status(422).json({
      message,
    });
  }

  if (err instanceof NotFoundException) {
    return res.status(404).json({
      message: err.message,
    });
  }

  if (err instanceof BadRequestException) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedException) {
    return res.status(401).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal Server Error',
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).send({
    message: 'Not Found',
  });
}
