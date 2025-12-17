import { PokemonClass, PokemonType, BonusType, Achievement, GameItem, GymLeader } from './types';

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

// Simple Type Advantage Chart (Attacker -> Defender: Multiplier)
// Only including Super Effective (2x) for simplicity in auto-battler
export const TYPE_CHART: Record<PokemonType, PokemonType[]> = {
    normal: [],
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    steel: ['ice', 'rock', 'fairy'],
    dark: ['psychic', 'ghost'],
    fairy: ['fighting', 'dragon', 'dark']
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
    374, 375, 376, // Metagross line (Fixed/Confirmed)
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

const getSprite = (name: string) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;

// --- GAME ITEMS MARKET (SORTED ALPHABETICALLY) ---
// Using custom images for broken official sprites (Rusted items, Z-crystals)
export const GAME_ITEMS: GameItem[] = [
    { id: 'abomasite', name: 'Abomasite', price: 30000, description: 'Mega Evolve Abomasnow.', category: 'mega_stone', sprite: getSprite('abomasite') },
    { id: 'absolite', name: 'Absolite', price: 30000, description: 'Mega Evolve Absol.', category: 'mega_stone', sprite: getSprite('absolite') },
    { id: 'adamant_crystal', name: 'Adamant Crystal', price: 120000, description: 'Allows Dialga to enter Origin Forme.', category: 'orb', sprite: getSprite('adamant-orb') },
    { id: 'aerodactylite', name: 'Aerodactylite', price: 35000, description: 'Mega Evolve Aerodactyl.', category: 'mega_stone', sprite: getSprite('aerodactylite') },
    { id: 'aggronite', name: 'Aggronite', price: 35000, description: 'Mega Evolve Aggron.', category: 'mega_stone', sprite: getSprite('aggronite') },
    { id: 'alakazite', name: 'Alakazite', price: 35000, description: 'Mega Evolve Alakazam.', category: 'mega_stone', sprite: getSprite('alakazite') },
    { id: 'altarianite', name: 'Altarianite', price: 30000, description: 'Mega Evolve Altaria.', category: 'mega_stone', sprite: getSprite('altarianite') },
    { id: 'ampharosite', name: 'Ampharosite', price: 30000, description: 'Mega Evolve Ampharos.', category: 'mega_stone', sprite: getSprite('ampharosite') },
    { id: 'audinite', name: 'Audinite', price: 25000, description: 'Mega Evolve Audino.', category: 'mega_stone', sprite: getSprite('audinite') },
    { id: 'banettite', name: 'Banettite', price: 30000, description: 'Mega Evolve Banette.', category: 'mega_stone', sprite: getSprite('banettite') },
    { id: 'beedrillite', name: 'Beedrillite', price: 25000, description: 'Mega Evolve Beedrill.', category: 'mega_stone', sprite: getSprite('beedrillite') },
    { id: 'blastoisinite', name: 'Blastoisinite', price: 50000, description: 'Mega Evolve Blastoise.', category: 'mega_stone', sprite: getSprite('blastoisinite') },
    { id: 'blazikenite', name: 'Blazikenite', price: 50000, description: 'Mega Evolve Blaziken.', category: 'mega_stone', sprite: getSprite('blazikenite') },
    { id: 'blue_orb', name: 'Blue Orb', price: 100000, description: 'Triggers Primal Reversion for Kyogre.', category: 'orb', sprite: getSprite('blue-orb') },
    { id: 'cameruptite', name: 'Cameruptite', price: 30000, description: 'Mega Evolve Camerupt.', category: 'mega_stone', sprite: getSprite('cameruptite') },
    { id: 'charizardite_x', name: 'Charizardite X', price: 50000, description: 'Mega Evolve Charizard X.', category: 'mega_stone', sprite: getSprite('charizardite-x') },
    { id: 'charizardite_y', name: 'Charizardite Y', price: 50000, description: 'Mega Evolve Charizard Y.', category: 'mega_stone', sprite: getSprite('charizardite-y') },
    { id: 'diancite', name: 'Diancite', price: 60000, description: 'Mega Evolve Diancie.', category: 'mega_stone', sprite: getSprite('diancite') },
    { id: 'dna_splicers', name: 'DNA Splicers', price: 75000, description: 'Key Item. Fuses Kyurem with Reshiram or Zekrom.', category: 'key_item', sprite: getSprite('dna-splicers') },
    { id: 'dynamax_band', name: 'Dynamax Band', price: 100000, description: 'Key Item. Enables Dynamax and Gigantamax transformations.', category: 'key_item', sprite: 'https://archives.bulbagarden.net/media/upload/1/1c/Sword_Shield_Dynamax_Band.png' },
    { id: 'galladite', name: 'Galladite', price: 40000, description: 'Mega Evolve Gallade.', category: 'mega_stone', sprite: getSprite('galladite') },
    { id: 'garchompite', name: 'Garchompite', price: 55000, description: 'Mega Evolve Garchomp.', category: 'mega_stone', sprite: getSprite('garchompite') },
    { id: 'gardevoirite', name: 'Gardevoirite', price: 40000, description: 'Mega Evolve Gardevoir.', category: 'mega_stone', sprite: getSprite('gardevoirite') },
    { id: 'gengarite', name: 'Gengarite', price: 40000, description: 'Mega Evolve Gengar.', category: 'mega_stone', sprite: getSprite('gengarite') },
    { id: 'glalitite', name: 'Glalitite', price: 30000, description: 'Mega Evolve Glalie.', category: 'mega_stone', sprite: getSprite('glalitite') },
    { id: 'gracidea', name: 'Gracidea', price: 80000, description: 'Allows Shaymin to change into Sky Forme.', category: 'key_item', sprite: getSprite('gracidea') },
    { id: 'griseous_orb', name: 'Griseous Orb', price: 120000, description: 'Allows Giratina to enter Origin Forme.', category: 'orb', sprite: getSprite('griseous-orb') },
    { id: 'gyaradosite', name: 'Gyaradosite', price: 45000, description: 'Mega Evolve Gyarados.', category: 'mega_stone', sprite: getSprite('gyaradosite') },
    { id: 'heracronite', name: 'Heracronite', price: 35000, description: 'Mega Evolve Heracross.', category: 'mega_stone', sprite: getSprite('heracronite') },
    { id: 'houndoominite', name: 'Houndoominite', price: 30000, description: 'Mega Evolve Houndoom.', category: 'mega_stone', sprite: getSprite('houndoominite') },
    { id: 'kangaskhanite', name: 'Kangaskhanite', price: 35000, description: 'Mega Evolve Kangaskhan.', category: 'mega_stone', sprite: getSprite('kangaskhanite') },
    { id: 'latiasite', name: 'Latiasite', price: 50000, description: 'Mega Evolve Latias.', category: 'mega_stone', sprite: getSprite('latiasite') },
    { id: 'latiosite', name: 'Latiosite', price: 50000, description: 'Mega Evolve Latios.', category: 'mega_stone', sprite: getSprite('latiosite') },
    { id: 'lopunnite', name: 'Lopunnite', price: 30000, description: 'Mega Evolve Lopunny.', category: 'mega_stone', sprite: getSprite('lopunnite') },
    { id: 'lucarionite', name: 'Lucarionite', price: 40000, description: 'Mega Evolve Lucario.', category: 'mega_stone', sprite: getSprite('lucarionite') },
    { id: 'lustrous_globe', name: 'Lustrous Globe', price: 120000, description: 'Allows Palkia to enter Origin Forme.', category: 'orb', sprite: getSprite('lustrous-orb') },
    { id: 'manectite', name: 'Manectite', price: 30000, description: 'Mega Evolve Manectric.', category: 'mega_stone', sprite: getSprite('manectite') },
    { id: 'mawilite', name: 'Mawilite', price: 30000, description: 'Mega Evolve Mawile.', category: 'mega_stone', sprite: getSprite('mawilite') },
    { id: 'medichamite', name: 'Medichamite', price: 30000, description: 'Mega Evolve Medicham.', category: 'mega_stone', sprite: getSprite('medichamite') },
    { id: 'mega_bracelet', name: 'Mega Bracelet', price: 100000, description: 'Key Item. Enables Mega Evolution for Pokémon holding Mega Stones.', category: 'key_item', sprite: 'https://archives.bulbagarden.net/media/upload/2/2c/GO_GO_Mega_Bracelet_male.png' },
    { id: 'metagrossite', name: 'Metagrossite', price: 55000, description: 'Mega Evolve Metagross.', category: 'mega_stone', sprite: getSprite('metagrossite') },
    { id: 'n_lunarizer', name: 'N-Lunarizer', price: 85000, description: 'Key Item. Fuses Necrozma with Lunala.', category: 'key_item', sprite: 'https://archives.bulbagarden.net/media/upload/7/76/Bag_N-Lunarizer_SV_Sprite.png' },
    { id: 'n_solarizer', name: 'N-Solarizer', price: 85000, description: 'Key Item. Fuses Necrozma with Solgaleo.', category: 'key_item', sprite: 'https://archives.bulbagarden.net/media/upload/e/e4/Bag_N-Solarizer_SV_Sprite.png' },
    { id: 'pidgeotite', name: 'Pidgeotite', price: 30000, description: 'Mega Evolve Pidgeot.', category: 'mega_stone', sprite: getSprite('pidgeotite') },
    { id: 'pinsirite', name: 'Pinsirite', price: 35000, description: 'Mega Evolve Pinsir.', category: 'mega_stone', sprite: getSprite('pinsirite') },
    { id: 'prison_bottle', name: 'Prison Bottle', price: 150000, description: 'Transforms Hoopa into its Unbound form.', category: 'key_item', sprite: getSprite('prison-bottle') },
    { id: 'red_orb', name: 'Red Orb', price: 100000, description: 'Triggers Primal Reversion for Groudon.', category: 'orb', sprite: getSprite('red-orb') },
    { id: 'reins_of_unity', name: 'Reins of Unity', price: 90000, description: 'Key Item. Fuses Calyrex with Glastrier or Spectrier.', category: 'key_item', sprite: 'https://archives.bulbagarden.net/media/upload/1/10/Bag_Reins_of_Unity_SV_Sprite.png' },
    { id: 'reveal_glass', name: 'Reveal Glass', price: 80000, description: 'Changes the form of the Forces of Nature.', category: 'key_item', sprite: getSprite('reveal-glass') },
    { id: 'rusted_shield', name: 'Rusted Shield', price: 150000, description: 'Allows Zamazenta to enter Crowned Shield form.', category: 'held_item', sprite: 'https://archives.bulbagarden.net/media/upload/8/80/Bag_Rusted_Shield_SV_Sprite.png' },
    { id: 'rusted_sword', name: 'Rusted Sword', price: 150000, description: 'Allows Zacian to enter Crowned Sword form.', category: 'held_item', sprite: 'https://archives.bulbagarden.net/media/upload/a/ab/Bag_Rusted_Sword_SV_Sprite.png' },
    { id: 'sablenite', name: 'Sablenite', price: 30000, description: 'Mega Evolve Sableye.', category: 'mega_stone', sprite: getSprite('sablenite') },
    { id: 'salamencite', name: 'Salamencite', price: 55000, description: 'Mega Evolve Salamence.', category: 'mega_stone', sprite: getSprite('salamencite') },
    { id: 'sceptilite', name: 'Sceptilite', price: 50000, description: 'Mega Evolve Sceptile.', category: 'mega_stone', sprite: getSprite('sceptilite') },
    { id: 'scizorite', name: 'Scizorite', price: 40000, description: 'Mega Evolve Scizor.', category: 'mega_stone', sprite: getSprite('scizorite') },
    { id: 'sharpedonite', name: 'Sharpedonite', price: 30000, description: 'Mega Evolve Sharpedo.', category: 'mega_stone', sprite: getSprite('sharpedonite') },
    { id: 'slowbronite', name: 'Slowbronite', price: 30000, description: 'Mega Evolve Slowbro.', category: 'mega_stone', sprite: getSprite('slowbronite') },
    { id: 'steelixite', name: 'Steelixite', price: 35000, description: 'Mega Evolve Steelix.', category: 'mega_stone', sprite: getSprite('steelixite') },
    { id: 'swampertite', name: 'Swampertite', price: 50000, description: 'Mega Evolve Swampert.', category: 'mega_stone', sprite: getSprite('swampertite') },
    { id: 'tyranitarite', name: 'Tyranitarite', price: 55000, description: 'Mega Evolve Tyranitar.', category: 'mega_stone', sprite: getSprite('tyranitarite') },
    { id: 'ultranecrozium_z', name: 'Ultranecrozium Z', price: 250000, description: 'Allows fused Necrozma to become Ultra Necrozma.', category: 'key_item', sprite: 'https://img.pokemondb.net/sprites/items/ultranecrozium-z.png' },
    { id: 'venusaurite', name: 'Venusaurite', price: 50000, description: 'Mega Evolve Venusaur.', category: 'mega_stone', sprite: getSprite('venusaurite') },
    { id: 'z_ring', name: 'Z-Power Ring', price: 100000, description: 'Key Item. Enables Z-Moves and Ultra Burst (Necrozma).', category: 'key_item', sprite: 'https://img.pokemondb.net/sprites/items/z-power-ring.png' },
];

// FUSION REQUIREMENTS MAP: Result Pokedex ID -> Required Item ID
export const FUSION_ITEM_REQUIREMENTS: Record<number, string> = {
    // Kyurem
    10023: 'dna_splicers', // Black Kyurem
    10022: 'dna_splicers', // White Kyurem
    // Necrozma
    10155: 'n_solarizer', // Dusk Mane (Solgaleo)
    10156: 'n_lunarizer', // Dawn Wings (Lunala)
    // Calyrex
    10193: 'reins_of_unity', // Ice Rider
    10194: 'reins_of_unity', // Shadow Rider
};

// Map Pokemon ID to Required Item for Transformation/Evolution
// This overrides default costs in PokemonPanel logic if present
export const ITEM_REQUIREMENTS: Record<number, string> = {
    // Primals
    382: 'blue_orb', // Kyogre
    383: 'red_orb', // Groudon

    // Hero -> Crowned
    888: 'rusted_sword', // Zacian
    889: 'rusted_shield', // Zamazenta

    // Origin Forms (Hisui/Sinnoh items)
    483: 'adamant_crystal', // Dialga
    484: 'lustrous_globe', // Palkia
    487: 'griseous_orb', // Giratina

    // Forces of Nature
    641: 'reveal_glass',
    642: 'reveal_glass',
    645: 'reveal_glass',
    905: 'reveal_glass', // Enamorus

    // Other Forms
    720: 'prison_bottle', // Hoopa
    492: 'gracidea', // Shaymin

    // Ultra Necrozma (Requires fused forms)
    10155: 'ultranecrozium_z', // Dusk Mane
    10156: 'ultranecrozium_z', // Dawn Wings

    // Megas (Source ID)
    6: 'charizardite_x', // Defaulting X for simplicity in UI if only 1 button, usually needs choice
    3: 'venusaurite',
    9: 'blastoisinite',
    94: 'gengarite',
    150: 'mewtwonite_y', 
    448: 'lucarionite',
    384: 'rayquazite',
    
    // Adding more mega mappings for new stones
    460: 'abomasite',
    359: 'absolite',
    142: 'aerodactylite',
    306: 'aggronite',
    65: 'alakazite',
    334: 'altarianite',
    181: 'ampharosite',
    531: 'audinite',
    354: 'banettite',
    15: 'beedrillite',
    257: 'blazikenite',
    323: 'cameruptite',
    719: 'diancite',
    475: 'galladite',
    282: 'gardevoirite',
    445: 'garchompite',
    362: 'glalitite',
    130: 'gyaradosite',
    214: 'heracronite',
    229: 'houndoominite',
    115: 'kangaskhanite',
    380: 'latiasite',
    381: 'latiosite',
    428: 'lopunnite',
    310: 'manectite',
    303: 'mawilite',
    308: 'medichamite',
    376: 'metagrossite',
    18: 'pidgeotite',
    127: 'pinsirite',
    302: 'sablenite',
    373: 'salamencite',
    254: 'sceptilite',
    212: 'scizorite',
    319: 'sharpedonite',
    80: 'slowbronite',
    208: 'steelixite',
    260: 'swampertite',
    248: 'tyranitarite'
};

export const MEGA_EVOLUTION_MAP: Record<number, boolean> = {
    3: true,
    6: true,
    9: true,
    15: true,
    18: true,
    65: true,
    80: true,
    94: true,
    115: true,
    127: true,
    130: true,
    142: true,
    150: true,
    181: true,
    208: true,
    212: true,
    214: true,
    229: true,
    248: true,
    254: true,
    257: true,
    260: true,
    282: true,
    302: true,
    303: true,
    306: true,
    308: true,
    310: true,
    319: true,
    323: true,
    334: true,
    354: true,
    359: true,
    362: true,
    373: true,
    376: true,
    380: true,
    381: true,
    384: true,
    428: true,
    445: true,
    448: true,
    460: true,
    475: true,
    531: true,
    719: true
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
    383: 10078,
    
    // Forces of Nature (Therian Forms)
    641: 10019, // Tornadus
    642: 10020, // Thundurus
    645: 10021, // Landorus
    905: 10045, // Enamorus

    // Necrozma Fused -> Ultra
    10155: 10157, // Dusk Mane -> Ultra
    10156: 10157  // Dawn Wings -> Ultra
};

// --- GYM LEADERS ---
export const GYM_LEADERS: GymLeader[] = [
    {
        id: 'gym_1_brock',
        name: 'Brock',
        city: 'Pewter City',
        type: 'rock',
        badge: 'Boulder Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/1.png',
        difficultyRating: 500,
        rewardCredits: 5000,
        description: "The Rock-Solid Pokémon Trainer. His defense is tough to crack!",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/brock.png',
        acePokemonId: 95 // Onix
    },
    {
        id: 'gym_2_misty',
        name: 'Misty',
        city: 'Cerulean City',
        type: 'water',
        badge: 'Cascade Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/2.png',
        difficultyRating: 1200,
        rewardCredits: 10000,
        description: "The Tomboyish Mermaid. Watch out for her powerful water attacks!",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/misty.png',
        acePokemonId: 121 // Starmie
    },
    {
        id: 'gym_3_surge',
        name: 'Lt. Surge',
        city: 'Vermilion City',
        type: 'electric',
        badge: 'Thunder Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/3.png',
        difficultyRating: 2500,
        rewardCredits: 15000,
        description: "The Lightning American. His speed is shocking!",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/lt-surge.png',
        acePokemonId: 26 // Raichu
    },
    {
        id: 'gym_4_erika',
        name: 'Erika',
        city: 'Celadon City',
        type: 'grass',
        badge: 'Rainbow Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/4.png',
        difficultyRating: 4000,
        rewardCredits: 20000,
        description: "The Nature-Loving Princess. Don't let her flowers fool you.",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/erika.png',
        acePokemonId: 45 // Vileplume
    },
    {
        id: 'gym_5_koga',
        name: 'Koga',
        city: 'Fuchsia City',
        type: 'poison',
        badge: 'Soul Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/5.png',
        difficultyRating: 6000,
        rewardCredits: 30000,
        description: "The Poisonous Ninja Master. His toxins will drain you.",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/koga.png',
        acePokemonId: 110 // Weezing
    },
    {
        id: 'gym_6_sabrina',
        name: 'Sabrina',
        city: 'Saffron City',
        type: 'psychic',
        badge: 'Marsh Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/6.png',
        difficultyRating: 8500,
        rewardCredits: 40000,
        description: "The Master of Psychics. She can see your defeat coming.",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/sabrina.png',
        acePokemonId: 65 // Alakazam
    },
    {
        id: 'gym_7_blaine',
        name: 'Blaine',
        city: 'Cinnabar Island',
        type: 'fire',
        badge: 'Volcano Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/7.png',
        difficultyRating: 12000,
        rewardCredits: 50000,
        description: "The Hot-Headed Quiz Master. You'll get burned!",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/blaine.png',
        acePokemonId: 59 // Arcanine
    },
    {
        id: 'gym_8_giovanni',
        name: 'Giovanni',
        city: 'Viridian City',
        type: 'ground',
        badge: 'Earth Badge',
        badgeSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/8.png',
        difficultyRating: 18000,
        rewardCredits: 100000,
        description: "The Team Rocket Boss. The ultimate challenge.",
        leaderSprite: 'https://img.pokemondb.net/sprites/trainers/firered-leafgreen/giovanni.png',
        acePokemonId: 112 // Rhydon (Classic Giovanni ace representation)
    }
];

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

    // NEW: Shiny Collection
    ...[1, 5, 10].map(count => ({
        id: `shiny_${count}`,
        title: `Shiny Hunter ${count}`,
        description: `Own ${count} Shiny Pokémon.`,
        reward: count * 25000,
        category: 'shiny' as const,
        condition: (p: any) => p.inventory.filter((i: any) => i.isShiny).length >= count,
        progress: (p: any) => ({ current: p.inventory.filter((i: any) => i.isShiny).length, max: count })
    })),

    // NEW: Item Collection
    ...[1, 5, 10].map(count => ({
        id: `item_${count}`,
        title: `Item Collector ${count}`,
        description: `Own ${count} Unique Items (in Bag or Held).`,
        reward: count * 10000,
        category: 'item' as const,
        condition: (p: any) => {
            const bagCount = p.items.length;
            const heldCount = p.inventory.filter((pok: any) => !!pok.heldItem).length;
            return (bagCount + heldCount) >= count;
        },
        progress: (p: any) => {
            const bagCount = p.items.length;
            const heldCount = p.inventory.filter((pok: any) => !!pok.heldItem).length;
            return { current: bagCount + heldCount, max: count };
        }
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