export type BonusType = 'slot' | 'roulette' | 'rocket';
export type PokemonClass = 'F' | 'E' | 'D' | 'C' | 'B' | 'A';

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' 
  | 'rock' | 'ghost' | 'dragon' | 'steel' | 'dark' | 'fairy';

export type PokemonGroup = 'ALL' | 'starter' | 'legendary' | 'mythical' | 'pseudo' | 'ultrabeast' | 'paradox';

export interface MarketPokemon {
  uniqueId: string; // unique instance id
  pokedexId: number;
  name: string;
  sprite: string;
  class: PokemonClass;
  bonusType: BonusType;
  multiplier: number;
  price: number;
  types: PokemonType[];
  totalStats: number;
  isStarter?: boolean; 
  isShiny?: boolean;
}

export interface PlayerStats {
  totalWinsRoulette: number;
  totalWinsSlots: number;
  totalBetsRocket: number;
  pokemonBought: number;
  highestWealth: number;
}

export interface PlayerState {
  credits: number;
  inventory: MarketPokemon[];
  equippedPokemonIds: string[]; // Supports up to 6
  starterEvolutionStage: number;
  stats: PlayerStats;
  completedAchievementIds: string[];
  hasPickedStarter: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'wealth' | 'collection' | 'game' | 'type';
  condition: (player: PlayerState) => boolean;
  progress: (player: PlayerState) => { current: number; max: number };
}

export interface MarketFilter {
  targetClass: PokemonClass | 'ALL';
  targetBonus: BonusType | 'ALL';
  targetGen: number | 'ALL'; // 1-9
  targetType: PokemonType[];
  targetGroup: PokemonGroup;
}

export type GameTab = 'roulette' | 'rocket' | 'slots' | 'market' | 'collection' | 'achievements';