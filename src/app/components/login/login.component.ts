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
  this.authService.validarSesion().subscribe(res => {
    if (res.logueado) {
      this.router.navigate(['/pokemons']);
    }
  });
}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
    this.authService.login({
      usuario: this.username,
      clave: this.password
    }).subscribe({
      next: res => {
        console.log('Login OK', res);
        this.router.navigate(['/pokemons']);
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Credenciales inválidas';
      }
    });

    // Cambia la visibilidad de la contraseña
    this.togglePasswordVisibility();
  }
}
