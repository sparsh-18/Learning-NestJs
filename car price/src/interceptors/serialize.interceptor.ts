import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// in order to make sure only a class is passed inside Serialize parameter
interface ClassInterface {
  new (...args: any[]): {};
}

// to convert into a decorator
export function Serialize(dto: ClassInterface) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassInterface) {} // so that we can pass anything to the interceptor

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Here run something before request is send to controller

    return next.handle().pipe(
      map((data: any) => {
        // here run anything after controller is executed, reponse is in data
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // this excludes any fields not marked with @Expose
        });
      }),
    );
  }
}
