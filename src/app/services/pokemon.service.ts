import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Modelo de dominio Pokémon usado en toda la app
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

@Injectable({
  // Servicio singleton para consumo de la PokeAPI
  providedIn: 'root'
})
export class PokemonService {

  // URL base de la PokeAPI
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Obtiene Pokémon por lista de paginación reducida a 20 para más rendimiento
  getPokemons(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        switchMap(response => {
          const requests: Observable<any>[] =
            response.results.map((p: any) => this.http.get(p.url));
          // Espera todas las respuestas
          return forkJoin(requests);
        }),
        map((pokemons: any[]) =>
          pokemons.map((p: any) => this.formatPokemon(p))
        )
      );
  }

  // Obtiene Pokémon por ID o número
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http
      .get<any>(`${this.baseUrl}/pokemon/${id}`)
      .pipe(map((p: any) => this.formatPokemon(p)));
  }

  // Obtiene Pokémon filtrados por tipo
  getPokemonsByType(type: string): Observable<Pokemon[]> {
    return this.http
      .get<any>(`${this.baseUrl}/type/${type}`)
      .pipe(
        // Limita resultados y obtiene detalle de cada Pokémon
        switchMap(response => {
          const requests = response.pokemon
            .slice(0, 20)
            .map((p: any) =>
              this.http.get<any>(p.pokemon.url)
            );
          return forkJoin(requests) as Observable<any[]>;
        }),
        // Limpia errores y normaliza resultados
        map((pokemons: any[]) =>
          pokemons.map((p: any) => this.formatPokemon(p))
        )
      );
  }

  // Formatea datos crudos desde la API al modal Pokemón
  private formatPokemon(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other['official-artwork'].front_default ||
        data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };
  }
}
