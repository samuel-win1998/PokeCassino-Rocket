import { PokemonClass, PokemonType, BonusType, Achievement } from './types';

// New Fixed Multipliers
export const CLASS_FIXED_MULTIPLIERS: Record<PokemonClass, number> = {
  F: 0.5,
  E: 1.0,
  D: 2.0,
  C: 5.0,
  B: 10.0,
  A: 25.0,
};

export const GENERATION_RANGES: Record<number, { min: number, max: number }> = {
    1: { min: 1, max: 151 },
    2: { min: 152, max: 251 },
    3: { min: 252, max: 386 },
    4: { min: 387, max: 493 },
    5: { min: 494, max: 649 },
    6: { min: 650, max: 721 },
    7: { min: 722, max: 809 },
    8: { min: 810, max: 905 },
    9: { min: 906, max: 1025 },
};

export const TYPE_COLORS: Record<PokemonType, string> = {
    normal: 'bg-neutral-500',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-600',
    ghost: 'bg-violet-700',
    dragon: 'bg-indigo-700',
    steel: 'bg-slate-400',
    dark: 'bg-neutral-800',
    fairy: 'bg-pink-300',
};

// Hardcoded lists for groups that are hard to filter via simple API flags
export const STARTER_IDS = [
    1, 4, 7, // Gen 1
    152, 155, 158, // Gen 2
    252, 255, 258, // Gen 3
    387, 390, 393, // Gen 4
    495, 498, 501, // Gen 5
    650, 653, 656, // Gen 6
    722, 725, 728, // Gen 7
    810, 813, 816, // Gen 8
    906, 909, 912  // Gen 9
];

export const PSEUDO_LEGENDARY_IDS = [
    147, 148, 149, // Dragonite line
    246, 247, 248, // Tyranitar line
    371, 372, 373, // Salamence line
    374, 375, 376, // Metagross line
    443, 444, 445, // Garchomp line
    633, 634, 635, // Hydreigon line
    704, 705, 706, // Goodra line
    782, 783, 784, // Kommo-o line
    885, 886, 887, // Dragapult line
    996, 997, 998  // Baxcalibur line
];

export const ULTRA_BEAST_IDS = [
    793, 794, 795, 796, 797, 798, 799, 800, 803, 804, 805, 806
];

export const PARADOX_IDS = [
    984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 
    994, 995, 1005, 1006, 1007, 1008, 1009, 1010
];

export const LEGENDARY_IDS = [
    144, 145, 146, 150, // Gen 1
    243, 244, 245, 249, 250, // Gen 2
    377, 378, 379, 380, 381, 382, 383, 384, // Gen 3
    480, 481, 482, 483, 484, 485, 486, 487, 488, // Gen 4
    638, 639, 640, 641, 642, 643, 644, 645, 646, // Gen 5
    716, 717, 718, // Gen 6
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, // Gen 7
    888, 889, 890, 891, 892, 894, 895, 896, 897, 898, // Gen 8
    1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024 // Gen 9 (Approx)
];

export const MYTHICAL_IDS = [
    151, // Mew
    251, // Celebi
    385, 386, // Jirachi, Deoxys
    489, 490, 491, 492, 493, // Phione, Manaphy, Darkrai, Shaymin, Arceus
    494, 647, 648, 649, // Victini, Keldeo, Meloetta, Genesect
    719, 720, 721, // Diancie, Hoopa, Volcanion
    801, 802, 807, 808, 809, // Magearna, Marshadow, Zeraora, Meltan, Melmetal
    893, // Zarude
    1025 // Pecharunt
];

export const CLASS_COLORS: Record<PokemonClass, string> = {
  F: 'text-slate-400 border-slate-600',
  E: 'text-emerald-200 border-emerald-700',
  D: 'text-blue-300 border-blue-600',
  C: 'text-violet-300 border-violet-500',
  B: 'text-fuchsia-300 border-fuchsia-500',
  A: 'text-yellow-300 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
};

export const SLOT_ICONS = [
  { symbol: "🍒", name: 'Cherry', chance: 0.40, payout: 0.5 },
  { symbol: "🍋", name: 'Lemon', chance: 0.25, payout: 0.8 },
  { symbol: "🔔", name: 'Bell', chance: 0.15, payout: 2 },
  { symbol: "🔥", name: 'Coin', chance: 0.10, payout: 5 },
  { symbol: "🐯", name: 'Tiger', chance: 0.07, payout: 15 },
  { symbol: "💎", name: 'Diamond', chance: 0.03, payout: 50 }
];

export const POKEMON_DATA: Record<string, { base: { apiName: string, name: string, bonusDesc: string }, bonusType: BonusType }> = {
    bulbasaur: {
        base: { apiName: 'bulbasaur', name: 'Bulbasaur', bonusDesc: '+10% Roulette Luck' },
        bonusType: 'roulette'
    },
    charmander: {
        base: { apiName: 'charmander', name: 'Charmander', bonusDesc: '+10% Rocket Fuel' },
        bonusType: 'rocket'
    },
    squirtle: {
        base: { apiName: 'squirtle', name: 'Squirtle', bonusDesc: '+10% Slot Luck' },
        bonusType: 'slot'
    }
};

export const MEGA_EVOLUTION_MAP: Record<number, boolean> = {
    3: true,
    6: true,
    9: true,
    15: true,
    18: true,
    65: true,
    94: true,
    130: true,
    142: true,
    150: true,
    212: true,
    248: true,
    254: true,
    257: true,
    260: true,
    282: true,
    373: true,
    376: true,
    384: true,
    445: true,
    448: true,
    475: true,
};

// --- FUSION & FORMS ---
// Base ID -> [{ partnerId, resultId, name }]
// name is the RESULT name, not the partner name
export const FUSION_PAIRS: Record<number, { partnerId: number, resultId: number, name: string }[]> = {
    800: [ // Necrozma
        { partnerId: 791, resultId: 10155, name: "Dusk Mane" }, // Solgaleo
        { partnerId: 792, resultId: 10156, name: "Dawn Wings" } // Lunala
    ],
    646: [ // Kyurem
        { partnerId: 644, resultId: 10023, name: "Black Kyurem" }, // Zekrom
        { partnerId: 643, resultId: 10022, name: "White Kyurem" }  // Reshiram
    ],
    898: [ // Calyrex
        { partnerId: 896, resultId: 10193, name: "Ice Rider" },    // Glastrier
        { partnerId: 897, resultId: 10194, name: "Shadow Rider" }  // Spectrier
    ]
};

// Current ID -> Next ID (LINEAR, NO LOOPS)
export const FORM_CHAINS: Record<number, number> = {
    // Zygarde: 10% (10118) -> 50% (718) -> Complete (10120) -> [End]
    10118: 718, 718: 10120,
    
    // Dialga: Base (483) -> Origin (10245) -> [End]
    483: 10245,
    
    // Palkia: Base (484) -> Origin (10246) -> [End]
    484: 10246,

    // Giratina: Altered (487) -> Origin (10007) -> [End]
    487: 10007,

    // Zacian: Hero (888) -> Crowned (10188) -> [End]
    888: 10188,

    // Zamazenta: Hero (889) -> Crowned (10189) -> [End]
    889: 10189,

    // Eternatus: Base (890) -> Eternamax (10190) -> [End]
    890: 10190,

    // Deoxys: Normal (386) -> Attack (10001) -> Defense (10002) -> Speed (10003) -> [End]
    386: 10001, 10001: 10002, 10002: 10003,

    // Shaymin: Land (492) -> Sky (10006) -> [End]
    492: 10006,

    // Hoopa: Confined (720) -> Unbound (10024) -> [End]
    720: 10024,

    // Meloetta: Aria (648) -> Pirouette (10018) -> [End]
    648: 10018,

    // Kyogre: Base (382) -> Primal (10077) -> [End]
    382: 10077,

    // Groudon: Base (383) -> Primal (10078) -> [End]
    383: 10078
};

// --- ACHIEVEMENTS SYSTEM ---

const formatNumber = (num: number) => {
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + 'T';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

const generateTypeAchievements = (): Achievement[] => {
    const types = Object.keys(TYPE_COLORS) as PokemonType[];
    const milestones = [1, 5, 10];
    const achievements: Achievement[] = [];

    types.forEach(type => {
        milestones.forEach(count => {
            achievements.push({
                id: `type_${type}_${count}`,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Collector ${count}`,
                description: `Own ${count} ${type}-type Pokémon.`,
                reward: count * 5000,
                category: 'type',
                condition: (player) => player.inventory.filter(p => p.types.includes(type)).length >= count,
                progress: (player) => ({ current: player.inventory.filter(p => p.types.includes(type)).length, max: count })
            });
        });
    });
    return achievements;
};

export const ACHIEVEMENTS: Achievement[] = [
    // Wealth
    {
        id: 'wealth_1m',
        title: 'Millionaire',
        description: 'Reach 1,000,000 Credits wealth.',
        reward: 50000,
        category: 'wealth',
        condition: (p) => p.stats.highestWealth >= 1000000,
        progress: (p) => ({ current: p.stats.highestWealth, max: 1000000 })
    },
    {
        id: 'wealth_1b',
        title: 'Billionaire',
        description: 'Reach 1 Billion Credits wealth.',
        reward: 5000000,
        category: 'wealth',
        condition: (p) => p.stats.highestWealth >= 1000000000,
        progress: (p) => ({ current: p.stats.highestWealth, max: 1000000000 })
    },
    {
        id: 'wealth_1t',
        title: 'Trillionaire',
        description: 'Reach 1 Trillion Credits wealth.',
        reward: 5000000000,
        category: 'wealth',
        condition: (p) => p.stats.highestWealth >= 1000000000000,
        progress: (p) => ({ current: p.stats.highestWealth, max: 1000000000000 })
    },
    
    // Market Buying
    ...[10, 50, 100].map(count => ({
        id: `buy_${count}`,
        title: `Shopaholic ${count}`,
        description: `Buy ${count} Pokémon from the Market.`,
        reward: count * 1000,
        category: 'collection' as const,
        condition: (p: any) => p.stats.pokemonBought >= count,
        progress: (p: any) => ({ current: p.stats.pokemonBought, max: count })
    })),

    // Roulette Wins
    ...[10, 50, 100].map(count => ({
        id: `roulette_win_${count}`,
        title: `Roulette Master ${count}`,
        description: `Win ${count} times in Roulette.`,
        reward: count * 2000,
        category: 'game' as const,
        condition: (p: any) => p.stats.totalWinsRoulette >= count,
        progress: (p: any) => ({ current: p.stats.totalWinsRoulette, max: count })
    })),

    // Slots Wins
    ...[10, 50, 100].map(count => ({
        id: `slots_win_${count}`,
        title: `Slot Tycoon ${count}`,
        description: `Win ${count} times in Slots.`,
        reward: count * 2000,
        category: 'game' as const,
        condition: (p: any) => p.stats.totalWinsSlots >= count,
        progress: (p: any) => ({ current: p.stats.totalWinsSlots, max: count })
    })),

    // Rocket Bets
    ...[10, 50, 100].map(count => ({
        id: `rocket_bet_${count}`,
        title: `Rocket Pilot ${count}`,
        description: `Play Rocket Crash ${count} times.`,
        reward: count * 1500,
        category: 'game' as const,
        condition: (p: any) => p.stats.totalBetsRocket >= count,
        progress: (p: any) => ({ current: p.stats.totalBetsRocket, max: count })
    })),

    // Add Element Types
    ...generateTypeAchievements()
];