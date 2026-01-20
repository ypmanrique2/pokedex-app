import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Inyección de dependencias
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }
  // canActivate verifica si el usuario está autenticado
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    // Redirige a login si no hay autenticación
    this.router.navigate(['/login']);
    return false;
  }
}
