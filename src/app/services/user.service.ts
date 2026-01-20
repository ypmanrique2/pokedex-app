import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

// Modelo de perfil de usuario usado en la app
export interface UserProfile {
  nickname: string;
  email: string;
  favoriteTypes: string[];
  favoriteMovieGenres: string[];
  avatar: string;
}

@Injectable({
  providedIn: 'root' // Singleton global
})
export class UserService {
  private loggedIn = false;

  // Clave única para persistir el perfil
  private readonly USER_KEY = 'user_profile';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  // Perfil por defecto (fallback si no hay sesión)
  private readonly defaultProfile: UserProfile = {
    nickname: 'iptdevs',
    email: 'iptdevs@pokemon.com',
    favoriteTypes: [],
    favoriteMovieGenres: [],
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  };

  // Estado reactivo de usuario; se inicializa desde localStorage.
  private userProfileSubject = new BehaviorSubject<UserProfile>(
    this.loadProfile()
  );

  // Observable que consume los componentes
  public readonly userProfile$: Observable<UserProfile> =
    this.userProfileSubject.asObservable();

  constructor() { }

  // Retorna el perfil actual en memoria
  getUserProfile(): UserProfile {
    return this.userProfileSubject.value;
  }

  // Actualiza perfil y lo persiste
  updateUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
    this.userProfileSubject.next(profile);
  }

  // Limpia la sesión (logout)
  clearProfile(): void {
    localStorage.removeItem(this.USER_KEY);
    this.userProfileSubject.next(this.defaultProfile);
  }

  // Carga inicial desde localStorage
  private loadProfile(): UserProfile {
    const saved = localStorage.getItem(this.USER_KEY);
    return saved ? JSON.parse(saved) : this.defaultProfile;
  }
}
