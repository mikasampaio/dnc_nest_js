import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (!userId) throw new BadRequestException('User ID is required');

    if (isNaN(Number(userId)))
      throw new BadRequestException('User ID must be a number');

    next();
  }
}
