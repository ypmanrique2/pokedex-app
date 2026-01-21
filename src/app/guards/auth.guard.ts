import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable, map, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Consulta al backend si hay sesión activa
    return this.auth.isAuthenticated$().pipe(
      tap(isAuth => {
        // Si no está autenticado, redirige a login
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      }),
      // El guard solo devuelve true o false
      map(isAuth => isAuth)
    );
  }
}
