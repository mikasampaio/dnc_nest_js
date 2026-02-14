import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dateNow = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        console.log(
          `Request to ${request.url} handled in ${Date.now() - dateNow}ms`,
        );
      }),
    );
  }
}
