import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya hay sesión, redirige
    this.authService.validarSesion().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/pokemons']);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    this.authService.login({
      usuario: this.username,
      clave: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/pokemons']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
}
