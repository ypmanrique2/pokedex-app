import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API_URL = environment.apiUrl;
  private authenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  isAuthenticated$(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  login(data: { usuario: string; clave: string }) {
    return this.http
      .post<any>(`${this.API_URL}/api/auth/login`, data, {
        withCredentials: true
      })
      .pipe(
        tap(res => {
          if (res?.logueado) {
            this.authenticated$.next(true);

            // Sincroniza perfil
            this.userService.updateUserProfile({
              nickname: res.perfil.nombre || res.perfil.usuario,
              email: '',
              favoriteTypes: [],
              favoriteMovieGenres: [],
              avatar: res.perfil.avatar || ''
            });
          }
        })
      );

  }

  validarSesion(): Observable<boolean> {
    return this.http
      .get<any>(`${this.API_URL}/api/auth/validar`, {
        withCredentials: true
      })
      .pipe(
        map(res => res.logueado === true),
        tap(isAuth => this.authenticated$.next(isAuth))
      );
  }

  logout() {
    return this.http
      .post(`${this.API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
      .pipe(
        tap(() => this.authenticated$.next(false))
      );
  }
}
