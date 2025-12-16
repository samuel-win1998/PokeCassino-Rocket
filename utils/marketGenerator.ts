import { MarketPokemon, PokemonClass, BonusType, MarketFilter, PokemonType } from '../types';
import { CLASS_FIXED_MULTIPLIERS, GENERATION_RANGES, STARTER_IDS, PSEUDO_LEGENDARY_IDS, ULTRA_BEAST_IDS, PARADOX_IDS, LEGENDARY_IDS, MYTHICAL_IDS } from '../constants';

const TOTAL_POKEMON = 1025;
const BONUS_TYPES: BonusType[] = ['roulette', 'rocket', 'slot'];

// --- Helper: Class Generation ---
const CLASS_PROBABILITIES: { class: PokemonClass; weight: number }[] = [
  { class: 'F', weight: 40 },
  { class: 'E', weight: 25 },
  { class: 'D', weight: 15 },
  { class: 'C', weight: 10 },
  { class: 'B', weight: 7 },
  { class: 'A', weight: 3 },
];

export const getRandomClass = (forceHighTier: boolean): PokemonClass => {
  if (forceHighTier) return Math.random() > 0.7 ? 'A' : 'B';
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const item of CLASS_PROBABILITIES) {
    cumulative += item.weight;
    if (rand < cumulative) return item.class;
  }
  return 'F';
};

// --- Helper: Multiplier Calculation ---
export const calculateMultiplier = (totalStats: number, pClass: PokemonClass): number => {
    const basePercent = totalStats / 100;
    const classMult = CLASS_FIXED_MULTIPLIERS[pClass];
    return (basePercent * classMult) / 100; 
};

// --- Helper: Market Refresh Cost Calculation ---
export const calculateRefreshCost = (filter: MarketFilter): number => {
    let cost = 1000; // Base Cost

    // Type Filter (+5000 if specific types selected)
    if (filter.targetType && filter.targetType.length > 0) {
        cost += 5000;
    }

    // Specific Bonus Game Filter (+5000)
    if (filter.targetBonus !== 'ALL') {
        cost += 5000;
    }

    // Group Filter Costs (Based on strength/rarity)
    if (filter.targetGroup !== 'ALL') {
        switch (filter.targetGroup) {
            case 'starter': cost += 1000; break;
            case 'pseudo': cost += 5000; break;
            case 'paradox': cost += 10000; break;
            case 'ultrabeast': cost += 15000; break;
            case 'mythical': cost += 20000; break;
            case 'legendary': cost += 25000; break;
        }
    }

    // Class Filter Costs
    if (filter.targetClass !== 'ALL') {
        switch (filter.targetClass) {
            case 'F': cost -= 500; break;
            case 'E': break; // +0
            case 'D': cost += 1000; break;
            case 'C': cost += 5000; break;
            case 'B': cost += 10000; break;
            case 'A': cost += 25000; break;
        }
    }

    // Ensure cost doesn't go below zero (though logical minimum is 500 with F class)
    return Math.max(0, cost);
};

// --- Helper: Fetch Data ---
export const fetchPokemonData = async (id: number): Promise<{ name: string, sprite: string, shinySprite: string, totalStats: number, types: PokemonType[], isLegendary: boolean, isMythical: boolean } | null> => {
  try {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!pokemonRes.ok) throw new Error(`Pokemon fetch failed for ${id}`);
    const data = await pokemonRes.json();

    const speciesRes = await fetch(data.species.url);
    if (!speciesRes.ok) throw new Error(`Species fetch failed for ${data.species.url}`);
    const speciesData = await speciesRes.json();
    
    const rawName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const name = rawName.replace(/-/g, ' ');

    const totalStats = data.stats.reduce((acc: number, stat: any) => acc + stat.base_stat, 0);
    
    // Sprites
    const sprite = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    // Use Home sprite for shiny as it is higher quality than default front_shiny, fallback to standard front_shiny
    const shinySprite = data.sprites.other?.home?.front_shiny || data.sprites.front_shiny || sprite;

    const types = data.types.map((t: any) => t.type.name as PokemonType);

    return { 
        name, 
        sprite,
        shinySprite,
        totalStats, 
        types, 
        isLegendary: speciesData.is_legendary, 
        isMythical: speciesData.is_mythical 
    };
  } catch (e) {
    console.warn(`Failed to fetch pokemon ${id}`, e);
    return null; 
  }
};

// --- Helper: Smart Pool Calculation ---
const getValidIdPool = async (filter: MarketFilter): Promise<number[]> => {
    let pool: number[] = [];

    // 1. Determine Base Pool Source
    if (filter.targetGroup !== 'ALL') {
        switch (filter.targetGroup) {
            case 'starter': pool = STARTER_IDS; break;
            case 'pseudo': pool = PSEUDO_LEGENDARY_IDS; break;
            case 'ultrabeast': pool = ULTRA_BEAST_IDS; break;
            case 'paradox': pool = PARADOX_IDS; break;
            case 'legendary': pool = LEGENDARY_IDS; break;
            case 'mythical': pool = MYTHICAL_IDS; break;
        }
    } else if (filter.targetType.length > 0) {
        try {
            const typePromises = filter.targetType.map(t => fetch(`https://pokeapi.co/api/v2/type/${t}`).then(res => res.json()));
            const results = await Promise.all(typePromises);
            
            const idSet = new Set<number>();
            results.forEach(data => {
                data.pokemon.forEach((p: any) => {
                    const parts = p.pokemon.url.split('/');
                    const id = parseInt(parts[parts.length - 2]);
                    if (id <= TOTAL_POKEMON) idSet.add(id);
                });
            });
            pool = Array.from(idSet);
        } catch {
            pool = []; // Type fetch failed
        }
    } else {
        // Default: All Pokemon
        pool = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);
    }

    // 2. Intersect with Generation
    if (filter.targetGen !== 'ALL') {
        // @ts-ignore
        const range = GENERATION_RANGES[filter.targetGen];
        pool = pool.filter(id => id >= range.min && id <= range.max);
    }

    return pool;
};

// --- Main Generator ---
export const generateMarketBatch = async (count: number, filter?: MarketFilter): Promise<MarketPokemon[]> => {
  const effectiveFilter = filter || { targetClass: 'ALL', targetBonus: 'ALL', targetGen: 'ALL', targetType: [], targetGroup: 'ALL' };
  
  const idPool = await getValidIdPool(effectiveFilter);
  const shuffledPool = idPool.sort(() => 0.5 - Math.random());
  
  const batch: MarketPokemon[] = [];
  let attempts = 0;
  const maxAttempts = 50; 

  for (const id of shuffledPool) {
      if (batch.length >= count) break;
      if (attempts >= maxAttempts) break;

      const data = await fetchPokemonData(id);
      if (!data) continue;

      attempts++;

      // Strict Type Check (OR logic: if pokemon has ANY of the target types)
      if (effectiveFilter.targetType.length > 0) {
          const hasType = data.types.some(t => effectiveFilter.targetType.includes(t));
          if (!hasType) {
              continue; 
          }
      }

      // Determine Class
      let pClass: PokemonClass;
      if (effectiveFilter.targetClass !== 'ALL') {
          pClass = effectiveFilter.targetClass;
      } else {
          pClass = getRandomClass(data.isLegendary || data.isMythical || ULTRA_BEAST_IDS.includes(id));
      }

      // SHINY CHECK (2% chance)
      const isShiny = Math.random() < 0.02;
      
      // Determine Bonus
      const bonusType = effectiveFilter.targetBonus !== 'ALL' 
        ? effectiveFilter.targetBonus 
        : BONUS_TYPES[Math.floor(Math.random() * BONUS_TYPES.length)];

      let multiplier = calculateMultiplier(data.totalStats, pClass);
      
      // Apply Shiny Bonus (1.2x Multiplier)
      if (isShiny) {
          multiplier *= 1.2;
      }

      // Price Calculation
      let rarityMult = 1;
      if (data.isLegendary) rarityMult = 5;
      else if (data.isMythical) rarityMult = 4;
      else if (PSEUDO_LEGENDARY_IDS.includes(id) || PARADOX_IDS.includes(id)) rarityMult = 3;
      else if (STARTER_IDS.includes(id)) rarityMult = 2;

      let basePrice = data.totalStats * 10;
      let classFactor = CLASS_FIXED_MULTIPLIERS[pClass]; 
      
      let finalPrice = Math.floor(basePrice * classFactor * rarityMult);

      // Shiny Price Increase
      if (isShiny) {
          finalPrice *= 2;
      }

      batch.push({
          uniqueId: Math.random().toString(36).substr(2, 9),
          pokedexId: id,
          name: data.name,
          sprite: isShiny ? data.shinySprite : data.sprite,
          class: pClass,
          bonusType,
          multiplier,
          price: finalPrice,
          types: data.types,
          totalStats: data.totalStats,
          isStarter: false,
          isShiny: isShiny
      });
  }

  return batch;
};

// --- Universal Evolution Logic ---
export const getNextEvolution = async (currentId: number): Promise<number | null> => {
    try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentId}`);
        if (!speciesRes.ok) throw new Error('Species fetch failed during evolution');
        const speciesData = await speciesRes.json();
        
        const chainUrl = speciesData.evolution_chain.url;
        const chainRes = await fetch(chainUrl);
        const chainData = await chainRes.json();

        let currentLink = chainData.chain;
        
        const findNext = (link: any): number | null => {
            const linkId = parseInt(link.species.url.split('/').slice(-2, -1)[0]);
            
            if (linkId === currentId) {
                if (link.evolves_to && link.evolves_to.length > 0) {
                    // Random Branching Logic
                    // If length > 1 (e.g., Eevee, Tyrogue), pick random index
                    const randomIndex = Math.floor(Math.random() * link.evolves_to.length);
                    const nextUrl = link.evolves_to[randomIndex].species.url;
                    return parseInt(nextUrl.split('/').slice(-2, -1)[0]);
                }
                return null; // No evolution found
            }
            
            for (const child of link.evolves_to) {
                const res = findNext(child);
                if (res) return res;
            }
            return null;
        };

        const nextId = findNext(currentLink);

        // Check for Megas if standard evolution not found (optional fallback)
        if (!nextId) {
             const varieties = speciesData.varieties;
             // Naive Mega check: look for 'mega' in name but not 'mega-x'/y unless generic
             const mega = varieties.find((v: any) => v.pokemon.name.includes('mega') && !v.pokemon.name.includes('mega-x')); 
             if (mega) {
                 const megaId = parseInt(mega.pokemon.url.split('/').slice(-2, -1)[0]);
                 return megaId;
             }
        }

        return nextId;

    } catch (e) {
        console.error("Evo fetch failed", e);
        return null;
    }
}

export const generateStarterClass = (): PokemonClass => getRandomClass(false);