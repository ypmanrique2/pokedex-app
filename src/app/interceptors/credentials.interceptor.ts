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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // No envia cookies a APIs públicas
    if (req.url.includes('pokeapi.co')) {
      return next.handle(req);
    }

    // Solo back-end propio
    const reqWithCredentials = req.clone({
      withCredentials: true
    });

    return next.handle(reqWithCredentials);
  }
}
