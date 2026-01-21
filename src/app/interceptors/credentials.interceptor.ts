import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {

  // Fuerza el envío de cookies en todas las peticiones HTTP
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const reqWithCredentials = req.clone({
      withCredentials: true
    });

    return next.handle(reqWithCredentials);
  }
}
