import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirige si ya hay sesión activa
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/pokemons']);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña requeridos';
      return;
    }

    // Toda la lógica vive en AuthService
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/pokemons']);
      return;
    }

    this.errorMessage = 'Credenciales inválidas';
    this.password = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
