import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Estado global de autenticación
  private authState$ = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.authState$.asObservable();

  // URL del backend ya desplegado
  private readonly API_URL = 'https://TU_BACKEND_URL';

  constructor(
    private http: HttpClient,
    private userService: UserService
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
          nickname: response.usuario, // viene del backend
          avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          email: '',
          favoriteTypes: [],
          favoriteMovieGenres: []
        });

        this.authState$.next(true);
      })
    );
  }

  // Logout real
  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.userService.clearProfile();
        this.authState$.next(false);
      })
    );
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
