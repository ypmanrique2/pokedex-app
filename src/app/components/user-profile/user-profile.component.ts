import { Component, OnInit } from '@angular/core';

import { PokemonService, Pokemon } from '../../services/pokemon.service';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  // Modelo local del perfil del usuario
  profile: UserProfile = {
    nickname: '',
    email: '',
    favoriteTypes: [],
    favoriteMovieGenres: [],
    avatar: ''
  };

  editMode: boolean = false;
  savedMessage: boolean = false;
  showPokemonSelector: boolean = false;
  availablePokemons: Pokemon[] = [];
  loadingPokemons: boolean = false;
  searchTerm: string = '';

  // Array de tipos de Pokémon disponibles desde la API
  availableTypes = [
    'fire', 'water', 'grass', 'electric', 'psychic',
    'dragon', 'normal', 'fighting', 'flying', 'poison',
    'ground', 'rock', 'bug', 'ghost', 'steel',
    'ice', 'dark', 'fairy'
  ];

  // Array de gpeneros de películas con sus etiquetas
  movieGenres = [
    { value: 'action', label: 'Acción' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'animation', label: 'Animación' },
    { value: 'comedy', label: 'Comedia' },
    { value: 'crime', label: 'Crimen' },
    { value: 'documentary', label: 'Documental' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasía' },
    { value: 'horror', label: 'Terror' },
    { value: 'mystery', label: 'Misterio' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Ciencia Ficción' },
    { value: 'thriller', label: 'Suspenso' },
    { value: 'western', label: 'Western' },
    { value: 'musical', label: 'Musical' },
    { value: 'war', label: 'Bélica' }
  ];

  constructor(
    // Inyección de servicios necesarios
    private userService: UserService,
    private pokemonService: PokemonService
  ) { }

  // Inicializa el perfil
  ngOnInit(): void {
    this.loadProfile();
  }

  // Carga el perfil actual desde el servicio
  loadProfile(): void {
    this.profile = { ...this.userService.getUserProfile() };
  }

  // Cambia al modo edición o carga el perfil si se cancela
  toggleEditMode(): void {
    if (this.editMode) {
      this.loadProfile();
    }
    this.editMode = !this.editMode;
  }

  // Guarda el perfil actualizado y quita modo edición
  saveProfile(): void {
    this.userService.updateUserProfile(this.profile);
    this.editMode = false;
    this.savedMessage = true;

    // Tiempo limite para el mensaje
    setTimeout(() => {
      this.savedMessage = false;
    }, 3000);
  }

  // Cambia la selección del tipo de Pokémon
  toggleType(type: string): void {
    const index = this.profile.favoriteTypes.indexOf(type);
    if (index > -1) {
      this.profile.favoriteTypes.splice(index, 1);
    } else {
      this.profile.favoriteTypes.push(type);
    }
  }

  // Verifica si el tipo de Pokémon fue seleccionado
  isTypeSelected(type: string): boolean {
    return this.profile.favoriteTypes.includes(type);
  }

  // Cambia la selección de un género de película
  toggleMovieGenre(genre: string): void {
    const index = this.profile.favoriteMovieGenres.indexOf(genre);
    if (index > -1) {
      this.profile.favoriteMovieGenres.splice(index, 1);
    } else {
      this.profile.favoriteMovieGenres.push(genre);
    }
  }

  // Verifica si el género de la película fue seleccionado
  isMovieGenreSelected(genre: string): boolean {
    return this.profile.favoriteMovieGenres.includes(genre);
  }

  // Obtiene el color asociado al género de película
  getMovieGenreColor(genre: string): string {
    const colors: { [key: string]: string } = {
      action: '#FF6B6B',
      adventure: '#4ECDC4',
      animation: '#FFE66D',
      comedy: '#FF8C42',
      crime: '#2E294E',
      documentary: '#95B8D1',
      drama: '#8B5CF6',
      fantasy: '#EC4899',
      horror: '#1F1F1F',
      mystery: '#6366F1',
      romance: '#F472B6',
      'sci-fi': '#3B82F6',
      thriller: '#EF4444',
      western: '#92400E',
      musical: '#A78BFA',
      war: '#64748B'
    };
    return colors[genre] || '#667eea';
  }

  // Obtiene la etiqueta legible del género de película
  getMovieGenreInfo(genreValue: string): { label: string } {
    const genre = this.movieGenres.find(g => g.value === genreValue);
    return genre || { label: genreValue };
  }

  openPokemonSelector(): void {
    this.showPokemonSelector = true;
    this.loadPopularPokemons();
  }

  closePokemonSelector(): void {
    this.showPokemonSelector = false;
    this.searchTerm = '';
  }

  // Carga Pokémon populares (hasta 50)
  loadPopularPokemons(): void {
    this.loadingPokemons = true;
    this.pokemonService.getPokemons(50, 0).subscribe({
      next: (data) => {
        this.availablePokemons = data;
        this.loadingPokemons = false;
      },
      error: (error) => {
        console.error('Error loading pokemons:', error);
        this.loadingPokemons = false;
      }
    });
  }

  // Busca Pokémon por nombre o ID (número
  searchPokemon(): void {
    if (!this.searchTerm.trim()) {
      this.loadPopularPokemons();
      return;
    }

    this.loadingPokemons = true;
    const searchId = parseInt(this.searchTerm);

    if (!isNaN(searchId) && searchId > 0) {
      this.pokemonService.getPokemonById(searchId).subscribe({
        next: (pokemon) => {
          this.availablePokemons = [pokemon];
          this.loadingPokemons = false;
        },
        error: (error) => {
          console.error('Pokemon not found:', error);
          this.availablePokemons = [];
          this.loadingPokemons = false;
        }
      });
    } else {
      // Buscar por nombre en los primeros 151
      this.pokemonService.getPokemons(151, 0).subscribe({
        next: (data) => {
          this.availablePokemons = data.filter(p =>
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.loadingPokemons = false;
        },
        error: (error) => {
          console.error('Error searching pokemon:', error);
          this.loadingPokemons = false;
        }
      });
    }
  }

  // Selecciona un Pokémon como avatar inicial
  selectPokemonAvatar(pokemon: Pokemon): void {
    this.profile.avatar = pokemon.image;
    this.closePokemonSelector();
  }

  // Obtiene el color asociado según el tipo de Pokémon
  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      dragon: '#7038F8',
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      ice: '#98D8D8',
      dark: '#705848',
      fairy: '#EE99AC'
    };
    return colors[type] || '#A8A878';
  }
}
