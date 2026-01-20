import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from './user.service';

const TOKEN_KEY = 'auth_token';
const DEFAULT_AVATAR =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Estado único de autenticación
  private authState$ = new BehaviorSubject<boolean>(false);

  // Observable público (solo lectura)
  readonly isAuthenticated$ = this.authState$.asObservable();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER = 'iptdevs';
  private readonly PASS = '123456';

  constructor(private userService: UserService) {
    this.restoreSession(); // Rehidrata sesión al arrancar la app
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = this.userService.getUserProfile();

    // Si existe token + perfil → sesión válida
    this.authState$.next(!!(token && user?.nickname));
  }

  login(username: string, password: string): boolean {
    if (username !== this.USER || password !== this.PASS) {
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

    this.authState$.next(true);
    return true;
  }

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
