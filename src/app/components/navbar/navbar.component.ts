import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // Observable que controla visibilidad
  isAuthenticated$ = this.auth.isAuthenticated$();
  // Streams directos desde los servicios
  readonly user$ = this.userService.userProfile$; // naming consistente

  constructor(
    // Servicio encargado del estado de autenticación
    private auth: AuthService,
    // Servicio que expone el perfil del usuario
    private userService: UserService,
    // Enrutamiento de navegación
    private router: Router
  ) { }
  // Cierra sesión; limpia estado de autenticación y redirige a login
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
