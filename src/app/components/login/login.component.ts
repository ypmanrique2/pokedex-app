import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Credenciales ingresadas por el usuario
  username: string = '';
  password: string = '';
  // Mensaje de error para feedback en UI
  errorMessage: string = '';
  // Controla visibilidad de la contraseña
  showPassword: boolean = false;

  constructor(
    // Manejo de autenticación
    private authService: AuthService,
    // Navegación entre vistas
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirige si ya hay sesión activa
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/pokemons']);
    }
  }

  onSubmit(): void {
    // Limpia errores previos
    this.errorMessage = '';

    // Validación básica de formulario
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña requeridos';
      return;
    }

    // Redirección o mensaje de error según resultado
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/pokemons']);
      return;
    }
    // Cuando se ingresan credenciales inválidas...
    this.errorMessage = 'Credenciales inválidas';
    this.password = '';
  }

  // Cambia la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
