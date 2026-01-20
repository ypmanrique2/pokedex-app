import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from './user.service';

const TOKEN_KEY = 'auth_token';
const DEFAULT_AVATAR =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private readonly VALID_USERNAME = 'iptdevs';
  private readonly VALID_PASSWORD = '123456';

  constructor(private userService: UserService) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = this.userService.getUserProfile();

    if (token && user?.nickname) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): boolean {
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {

      localStorage.setItem(
        TOKEN_KEY,
        btoa(`${username}:${Date.now()}`)
      );

      this.userService.updateUserProfile({
        nickname: username,
        email: `${username}@pokemon.com`,
        avatar: DEFAULT_AVATAR,
        favoriteTypes: [],
        favoriteMovieGenres: []
      });

      this.isAuthenticatedSubject.next(true);
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userService.clearProfile();
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
