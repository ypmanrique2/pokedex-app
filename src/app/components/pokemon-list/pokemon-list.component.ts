import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { forkJoin } from 'rxjs';

import { PokemonService, Pokemon } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, AfterViewInit, OnDestroy {
  // Referencia al div final para saber cuándo cargar más...
  @ViewChild('observerAnchor') observerAnchor!: ElementRef;
  // Almacena la lista completa de pokémones cargados
  pokemons: any[] = [];
  // Ciclo de vida para inicializar el Intersection Observer y cargar más pokémons
  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }
  // Almacena la lista que realmente se muestra en pantalla (útil para búsquedas y filtros)
  filteredPokemons: any[] = [];
  limit = 20; // Cantidad a cargar por petición
  offset = 0; // Desplazamiento actual (0, 20, 40...)
  loading = false; // Estado de carga para mostrar spinners y evitar peticiones duplicadas

  // Instancia del observador nativo del navegador para el scroll infinito
  private observer: IntersectionObserver | null = null;

  // Inyección del servicio que comunica con la PokeAPI
  constructor(private pokemonService: PokemonService) { }

  // Ciclo de Vida: Se ejecuta al iniciar el componente. Carga los primeros datos
  ngOnInit(): void {
    this.loadPokemons();
  }

  // Lógica del Scroll Infinito
  initIntersectionObserver() {
    const options = {
      root: null, // null significa que observa el viewport (la ventana)
      rootMargin: '0px', // Margen sin offset
      threshold: 0.5 // Se dispara cuando el 50% del elemento centinela es visible
    };

    // Callback que se ejecuta cuando la visibilidad del elemento cambia
    this.observer = new IntersectionObserver((entries) => {
      // Verifica si el elemento es visible y si no hay carga en curso
      if (entries[0].isIntersecting && !this.loading) {
        this.loadMore(); // Cargar más pokémons
      }
    }, options);

    // Empieza a observar el elemento si existe
    if (this.observerAnchor) {
      this.observer.observe(this.observerAnchor.nativeElement);
    }
  }

  // Ciclo de Vida: Se ejecuta al destruir el componente (cambio de ruta)
  ngOnDestroy(): void {
    // Buena práctica: Limpiar el observador al salir del componente
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Opciones para botones de filtro con íconos atractivos
  pokemonTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'strongest', label: '💪 Más Fuertes' },
    { value: 'popular', label: '⭐ Más Populares' },
    { value: 'legendary', label: '👑 Legendarios' },
    { value: 'fire', label: '🔥 Fuego' },
    { value: 'water', label: '💧 Agua' },
    { value: 'grass', label: '🌿 Planta' },
    { value: 'electric', label: '⚡ Eléctrico' },
    { value: 'psychic', label: '🔮 Psíquico' },
    { value: 'dragon', label: '🐉 Dragón' }
  ];

  // Variables para controlar modal de detalles y el filtro activo
  selectedPokemon: Pokemon | null = null;
  selectedFilter: string = 'all';

  // Carga inicial de Pokémons (paginación inicial)
  loadPokemons(): void {
    this.loading = true;
    // Obtiene Pokémon base con paginación
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (data) => {
        this.pokemons = data;
        this.filteredPokemons = data; // Al inicio, filtrados por todos (por defecto)
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pokemons:', error);
        this.loading = false;
      }
    });
  }

  // Filtra Pokémon según la selección del usuario
  onFilterChange(filterValue: string): void {
    this.selectedFilter = filterValue;
    this.loading = true;

    // Rutas de filtrado según tipo
    if (filterValue === 'all') {
      this.loadPokemons();
    } else if (filterValue === 'strongest') {
      this.loadStrongestPokemons();
    } else if (filterValue === 'popular') {
      this.loadPopularPokemons();
    } else if (filterValue === 'legendary') {
      this.loadLegendaryPokemons();
    } else {
      // Si no es un filtro especial, se asume que es un "Tipo" (fuego, agua...)
      this.pokemonService.getPokemonsByType(filterValue).subscribe({
        next: (data) => {
          this.filteredPokemons = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering pokemons:', error);
          this.loading = false;
        }
      });
    }
  }

  // Filtro preestablecido: "Más Fuertes"
  loadStrongestPokemons(): void {
    // Ordena Pokémon por suma total de stats hasta 50
    this.pokemonService.getPokemons(50, 0).subscribe({
      next: (data) => {
        // Ordenar por estadística (más fuertes primero)
        this.filteredPokemons = data
          .map(p => ({
            ...p,
            // Se suma todas las estadísticas base (HP, Ataque, Defensa...)
            totalStats: p.stats.reduce((sum, stat) => sum + stat.value, 0)
          }))
          // Orden descendente (Mayor a menor)
          .sort((a: any, b: any) => b.totalStats - a.totalStats)
          // primeras 20
          .slice(0, 20);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading strongest pokemons:', error);
        this.loading = false;
      }
    });
  }

  // Filtro preestablecido "Más populares"
  loadPopularPokemons(): void {
    // Pokémon populares: primeros 20 (generación 1), los más conocidos
    this.pokemonService.getPokemons(20, 0).subscribe({
      next: (data) => {
        this.filteredPokemons = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading popular pokemons:', error);
        this.loading = false;
      }
    });
  }

  // Filtro preestablecido "Legendarios"
  loadLegendaryPokemons(): void {
    // IDs de legendarios
    const legendaryIds = [
      144, 145, 146, 150, 151, 243, 244, 245, 249, 250,
      251, 377, 378, 379, 380, 381, 382, 383, 384, 385
    ];
    this.loading = true;

    // Peticiones paralelas o array de Observables (peticiones http pendientes)
    const requests = legendaryIds.map(id => this.pokemonService.getPokemonById(id));
    // forkJoin espera todas las respuestas
    forkJoin(requests).subscribe({
      next: (data) => {
        this.filteredPokemons = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading legendary pokemons:', error);
        this.loading = false;
      }
    });
  }

  // Método llamado por el IntersectionObserver para paginación
  loadMore(): void {
    this.offset += this.limit; // Se aumenta el desplazamiento
    this.loading = true;

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (data) => {
        // Se usael operador spread para agregar nuevos al final del array
        this.pokemons = [...this.pokemons, ...data];
        this.filteredPokemons = [...this.filteredPokemons, ...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading more pokemons:', error);
        this.loading = false;
      }
    });
  }

  // métodos de UI (Modal y estilos)

  openPokemonDetail(pokemon: Pokemon): void {
    // Abre modal de detalle
    this.selectedPokemon = pokemon;
  }

  closeDetail(): void {
    // Asignar null cierra el modal
    this.selectedPokemon = null;
  }

  getTypeColor(type: string): string {
    // Mapa de colores HEX por tipo de Pokémon
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
    // Si el tipo no existe, retorna color por defecto
    return colors[type] || '#A8A878';
  }
}
