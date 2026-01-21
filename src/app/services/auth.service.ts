import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(data: { usuario: string; clave: string }): Observable<any> {
    return this.http.post(
      `${this.API_URL}/api/auth/login`,
      data,
      { withCredentials: true }
    );
  }

  // Chequea si hay token de sesión en almacenamiento local
  isAuthenticated(): Observable<boolean> {
  return this.validarSesion().pipe(
    map(res => res.logueado === true)
  );
}

  validarSesion(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/api/auth/validar`,
      { withCredentials: true }
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  }
}
