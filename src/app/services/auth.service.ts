import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Estado global de autenticación
  private authState$ = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.authState$.asObservable();

  // URL del backend ya desplegado
  private readonly API_URL = 'https://pokedex-api-back-end.onrender.com';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.validateSession(); // rehidrata al refrescar
  }

  // Login REAL contra backend
  login(usuario: string, clave: string): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/login`,
      { usuario, clave },
      { withCredentials: true } // MUY IMPORTANTE
    ).pipe(
      tap((response: any) => {
        this.userService.updateUserProfile({
          nickname: response.perfil.usuario, // FIX
          avatar: response.perfil.avatar,
          email: '',
          favoriteTypes: [],
          favoriteMovieGenres: []
        });

        this.authState$.next(true);
      })
    );
  }

  // Logout real; limpia estado y redirige
  logout(): void {
    this.http.post<any>(
      `${this.API_URL}/logout`,
      {},
      { withCredentials: true }
    ).subscribe(() => {
      this.authState$.next(false);
      this.router.navigate(['/login']);
    });
  }

  // Validar sesión al refrescar
  private validateSession(): void {
    this.http.get<any>(
      `${this.API_URL}/validar`,
      { withCredentials: true }
    ).subscribe(res => {
      this.authState$.next(res.logueado === true);
    });
  }

  // Snapshot para Guards
  isAuthenticated(): boolean {
    return this.authState$.value;
  }
}
