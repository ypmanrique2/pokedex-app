import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from './user.service';

const TOKEN_KEY = 'auth_token';
const DEFAULT_AVATAR =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Estado interno de autenticación (true o false)
  private authState$ = new BehaviorSubject<boolean>(false);

  // Observable público (solo lectura)
  readonly isAuthenticated$ = this.authState$.asObservable();

  // Credenciales mockeadas para demostración
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER = 'iptdevs';
  private readonly PASS = '123456';

  constructor(private userService: UserService) {
    this.restoreSession(); // Rehidrata sesión al arrancar la app
  }

  private restoreSession(): void {
    // Genera token simulado
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Persiste sesión en localStorage
    const user = this.userService.getUserProfile();

    // Si existe token y el perfil confirma sesión válida
    this.authState$.next(!!(token && user?.nickname));
  }

  // Valida credenciales y simula autenticación
  login(username: string, password: string): boolean {
    // Validación básica contra credenciales predefinidas
    if (username !== this.USER || password !== this.PASS) {
      // Login fallido
      return false;
    }

    // Guardar token simple (simulación backend)
    localStorage.setItem(this.TOKEN_KEY, btoa(`${username}:${Date.now()}`));

    // Persistir perfil
    this.userService.updateUserProfile({
      nickname: username,
      email: `${username}@pokemon.com`,
      avatar: DEFAULT_AVATAR,
      favoriteTypes: [],
      favoriteMovieGenres: []
    });

    // Emite estado autenticado
    this.authState$.next(true);
    return true;
  }

  // Cierra y limpia sesión del usuario
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userService.clearProfile();
    this.authState$.next(false);
  }

  // Snapshot sincrónico (para Guards)
  isAuthenticated(): boolean {
    return this.authState$.value;
  }
}
