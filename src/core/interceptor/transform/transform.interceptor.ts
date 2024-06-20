import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

const WX_VALIDATE_URL = '/api/wx';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log(context.getArgs()[0].url);
    const url = context.getArgs()?.[0]?.url;
    return next.handle().pipe(
      map((data) => {
        return url.startsWith(WX_VALIDATE_URL)
          ? data
          : {
              data,
              code: 0,
              msg: '请求成功',
            };
      }),
    );
  }
}
