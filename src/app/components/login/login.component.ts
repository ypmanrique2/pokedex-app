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

  // Observable del envío del formulario de login
  onSubmit(): void {
    this.errorMessage = '';

    // Validación básica antes de llamar al back-end
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña requeridos';
      return;
    }

    // Login real contra back-end
    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          // Login exitoso y navega
          this.router.navigate(['/pokemons']);
        },
        error: () => {
          // Login fallido y retroalimenta en vista UI
          this.errorMessage = 'Credenciales inválidas';
          this.password = '';
        }
      });
  }

  // Cambia la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
