import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.apiUrl;

  // Estado global de autenticación
  private authenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // Observable público (solo lectura)
  isAuthenticated$(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  login(data: { usuario: string; clave: string }) {
  return this.http.post(
    `${this.API_URL}/api/auth/login`,
    data
  );
}

  validarSesion(): Observable<boolean> {
    return this.http
      .get<any>(`${this.API_URL}/api/auth/validar`)
      .pipe(
        map(res => res.logueado === true),
        tap(isAuth => this.authenticated$.next(isAuth))
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.API_URL}/api/auth/logout`, {})
      .pipe(
        tap(() => this.authenticated$.next(false))
      );
  }
}
