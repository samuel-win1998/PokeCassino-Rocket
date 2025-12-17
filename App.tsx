import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerState, GameTab, MarketPokemon, MarketFilter, Achievement, GameItem } from './types';
import { POKEMON_DATA, ACHIEVEMENTS, CLASS_FIXED_MULTIPLIERS, ITEM_REQUIREMENTS, MEGA_EVOLUTION_MAP, FUSION_ITEM_REQUIREMENTS, GAME_ITEMS } from './constants';
import { generateStarterClass, generateMarketBatch, fetchPokemonData, calculateMultiplier, getNextEvolution, calculateRefreshCost } from './utils/marketGenerator';
import { StarterSelection } from './components/StarterSelection';
import { SquadPanel } from './components/PokemonPanel';
import { Marketplace } from './components/Marketplace';
import { Collection } from './components/Collection';
import { HelpModal } from './components/HelpModal';
import { Achievements } from './components/Achievements';
import { Roulette } from './components/games/Roulette';
import { Rocket } from './components/games/Rocket';
import { Slots } from './components/games/Slots';

const SAVE_KEY = 'pokecasino_save_v1';

const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerState>({
    credits: 1000,
    inventory: [],
    equippedPokemonIds: [], 
    items: [], // New Items array
    badges: [],
    starterEvolutionStage: 0,
    stats: {
        totalWinsRoulette: 0,
        totalWinsSlots: 0,
        totalBetsRocket: 0,
        pokemonBought: 0,
        highestWealth: 1000
    },
    completedAchievementIds: [],
    hasPickedStarter: false
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<GameTab>('roulette');
  
  // UI State
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  // Market State (Lifted for Persistence)
  const [marketItems, setMarketItems] = useState<MarketPokemon[]>([]);
  const [marketTargetTime, setMarketTargetTime] = useState<number>(Date.now());
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketFilter, setMarketFilter] = useState<MarketFilter>({ 
      targetClass: 'ALL', 
      targetBonus: 'ALL', 
      targetGen: 'ALL', 
      targetType: [], 
      targetGroup: 'ALL' 
  });
  const [showMarketFilters, setShowMarketFilters] = useState(false);

  // --- Persistence Logic ---
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Data Sanitization: Ensure all inventory items have a uniqueId
        const sanitizedInventory = (parsed.inventory || []).map((p: any) => ({
            ...p,
            uniqueId: p.uniqueId || `legacy-${p.pokedexId}-${Date.now()}-${Math.random()}`
        }));

        setPlayer({
          credits: parsed.credits || 1000,
          inventory: sanitizedInventory,
          equippedPokemonIds: parsed.equippedPokemonIds || [],
          items: parsed.items || [], // Migration for old saves
          badges: parsed.badges || [],
          starterEvolutionStage: parsed.starterEvolutionStage || 0,
          stats: parsed.stats || { 
             totalWinsRoulette: 0, totalWinsSlots: 0, totalBetsRocket: 0, pokemonBought: 0, highestWealth: 1000 
          },
          completedAchievementIds: parsed.completedAchievementIds || [],
          hasPickedStarter: parsed.hasPickedStarter ?? true 
        });
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Only save if loaded to avoid overwriting with empty init state accidentally
    if (isLoaded) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    }
  }, [player, isLoaded]);

  // --- Achievement System ---
  const checkAchievements = useCallback((currentPlayer: PlayerState) => {
    const newCompletedIds: string[] = [];
    let rewardTotal = 0;
    let newAchievementsTitle = '';

    ACHIEVEMENTS.forEach(ach => {
        if (!currentPlayer.completedAchievementIds.includes(ach.id)) {
            if (ach.condition(currentPlayer)) {
                newCompletedIds.push(ach.id);
                rewardTotal += ach.reward;
                newAchievementsTitle = ach.title;
            }
        }
    });

    if (newCompletedIds.length > 0) {
        // Show Toast
        setToast({ 
            message: `Achievement Unlocked: ${newAchievementsTitle}${newCompletedIds.length > 1 ? ` +${newCompletedIds.length - 1} more` : ''} (+${rewardTotal.toLocaleString()})`, 
            visible: true 
        });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);

        setPlayer(prev => ({
            ...prev,
            credits: prev.credits + rewardTotal,
            completedAchievementIds: [...prev.completedAchievementIds, ...newCompletedIds],
            // Update wealth stats again in case reward bumped it
            stats: {
                ...prev.stats,
                highestWealth: Math.max(prev.stats.highestWealth, prev.credits + rewardTotal)
            }
        }));
    }
  }, []);

  // Check achievements on every stats/inventory change
  useEffect(() => {
      if (!isLoaded) return;
      checkAchievements(player);
  }, [player.credits, player.stats, player.inventory, player.items, isLoaded, checkAchievements]);

  // --- Handlers ---

  const handleMarketRefresh = useCallback(async (filter: MarketFilter, isPaid: boolean) => {
    if (isPaid) {
        const cost = calculateRefreshCost(filter);
        if (player.credits < cost) return;
        setPlayer(p => ({ ...p, credits: p.credits - cost }));
    }

    setMarketLoading(true);
    const effectiveFilter = {
        ...filter,
        targetGen: filter.targetGen || 'ALL',
        targetType: filter.targetType || [],
        targetGroup: filter.targetGroup || 'ALL'
    };
    
    const newItems = await generateMarketBatch(12, effectiveFilter);
    setMarketItems(newItems);
    setMarketTargetTime(Date.now() + 60000);
    setMarketLoading(false);
  }, [player.credits]);

  const handleStarterSelect = async (id: string) => {
    const chain = POKEMON_DATA[id];
    const starterClass = generateStarterClass(); 
    const initialId = id === 'bulbasaur' ? 1 : id === 'charmander' ? 4 : 7;
    
    const { name, sprite, totalStats, types } = await fetchPokemonData(initialId) as any;
    const multiplier = calculateMultiplier(totalStats, starterClass);

    // Calculate theoretical price for starter (Stats * 10 * Class * Rarity(2))
    const basePrice = totalStats * 10;
    const classFactor = CLASS_FIXED_MULTIPLIERS[starterClass];
    const rarityMult = 2; // Standard starter rarity multiplier
    const starterPrice = Math.floor(basePrice * classFactor * rarityMult);

    const starterPokemon: MarketPokemon = {
      uniqueId: 'starter-' + Date.now(),
      pokedexId: initialId,
      name: name,
      sprite: sprite,
      class: starterClass,
      bonusType: chain.bonusType,
      multiplier: multiplier,
      price: starterPrice,
      types: types,
      totalStats: totalStats,
      isStarter: true,
      isShiny: false
    };

    setPlayer({ 
      ...player, 
      credits: 1000, 
      inventory: [starterPokemon],
      equippedPokemonIds: [starterPokemon.uniqueId],
      items: [],
      badges: [],
      stats: { ...player.stats, pokemonBought: 0, highestWealth: 1000 },
      completedAchievementIds: [],
      hasPickedStarter: true
    });
  };

  const handleEvolution = async (uniqueId: string, cost: number) => {
    if (player.credits < cost) return;

    const pokemon = player.inventory.find(p => p.uniqueId === uniqueId);
    if (!pokemon) return;

    // KEY ITEM CHECK: Mega Evolution
    if (MEGA_EVOLUTION_MAP[pokemon.pokedexId]) {
        // 1. Must have Bracelet
        if (!player.items.includes('mega_bracelet')) {
            setToast({ message: "You need a Mega Bracelet to Mega Evolve!", visible: true });
            setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
            return;
        }

        // 2. Must hold specific Stone (if defined)
        const requiredStone = ITEM_REQUIREMENTS[pokemon.pokedexId];
        if (requiredStone && pokemon.heldItem !== requiredStone) {
             const itemName = GAME_ITEMS.find(i => i.id === requiredStone)?.name || requiredStone;
             setToast({ message: `Need to hold ${itemName} to Mega Evolve!`, visible: true });
             setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
             return;
        }
    }

    // Show loading state implicitly or via toast
    const nextPokedexId = await getNextEvolution(pokemon.pokedexId);
    
    if (!nextPokedexId) {
        // Just return silently, UI should have hidden button
        return; 
    }

    const data = await fetchPokemonData(nextPokedexId);
    if (!data) return;

    let newMultiplier = calculateMultiplier(data.totalStats, pokemon.class);
    if (pokemon.isShiny) newMultiplier *= 1.2;

    setPlayer(prev => {
        const inv = [...prev.inventory];
        const idx = inv.findIndex(p => p.uniqueId === uniqueId);
        if (idx === -1) return prev;

        inv[idx] = {
            ...inv[idx],
            name: data.name,
            sprite: pokemon.isShiny ? data.shinySprite : data.sprite,
            pokedexId: nextPokedexId,
            multiplier: newMultiplier,
            types: data.types,
            totalStats: data.totalStats
        };

        return {
            ...prev,
            credits: prev.credits - cost,
            inventory: inv
        };
    });
    
    setToast({ message: `Evolved into ${data.name}!`, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleFusion = async (baseId: string, partnerId: string, resultPokedexId: number, cost: number) => {
      if (player.credits < cost) return;

      // SPECIFIC ITEM CHECK BASED ON RESULT ID
      const requiredItemId = FUSION_ITEM_REQUIREMENTS[resultPokedexId];
      if (requiredItemId) {
          if (!player.items.includes(requiredItemId)) {
              const itemName = GAME_ITEMS.find(i => i.id === requiredItemId)?.name || requiredItemId;
              setToast({ message: `You need ${itemName} to fuse this Pokémon!`, visible: true });
              setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
              return;
          }
      } else {
          // Fallback if not in map (shouldn't happen with current constants)
          if (!player.items.includes('dna_splicers')) {
              setToast({ message: "You need DNA Splicers to fuse Pokémon!", visible: true });
              setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
              return;
          }
      }

      const basePokemon = player.inventory.find(p => p.uniqueId === baseId);
      const partnerPokemon = player.inventory.find(p => p.uniqueId === partnerId);
      if (!basePokemon || !partnerPokemon) return;

      const data = await fetchPokemonData(resultPokedexId);
      if (!data) return;

      // New Stats
      let newMultiplier = calculateMultiplier(data.totalStats, basePokemon.class);
      if (basePokemon.isShiny) newMultiplier *= 1.2; // Inherit shiny from base

      setPlayer(prev => {
          // Remove partner, update base to result
          const invWithoutPartner = prev.inventory.filter(p => p.uniqueId !== partnerId);
          const baseIndex = invWithoutPartner.findIndex(p => p.uniqueId === baseId);
          
          if (baseIndex === -1) return prev;

          invWithoutPartner[baseIndex] = {
              ...invWithoutPartner[baseIndex],
              pokedexId: resultPokedexId,
              name: data.name,
              sprite: basePokemon.isShiny ? data.shinySprite : data.sprite,
              types: data.types,
              totalStats: data.totalStats,
              multiplier: newMultiplier
          };

          // Also remove partner from equipped if equipped
          const newEquipped = prev.equippedPokemonIds.filter(id => id !== partnerId);

          return {
              ...prev,
              credits: prev.credits - cost,
              inventory: invWithoutPartner,
              equippedPokemonIds: newEquipped
          };
      });
      
      setToast({ message: `${data.name} Created!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleFormChange = async (uniqueId: string, nextPokedexId: number, cost: number) => {
      if (player.credits < cost) return;

      const pokemon = player.inventory.find(p => p.uniqueId === uniqueId);
      if (!pokemon) return;

      // KEY ITEM CHECK: Ultra Burst (Necrozma) or Dynamax (Eternatus)
      // Ultra Necrozma ID: 10157
      if (nextPokedexId === 10157) {
          if (!player.items.includes('z_ring')) {
              setToast({ message: "You need a Z-Power Ring to use Ultra Burst!", visible: true });
              setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
              return;
          }
      }
      // Eternamax Eternatus ID: 10190
      if (nextPokedexId === 10190) {
           if (!player.items.includes('dynamax_band')) {
              setToast({ message: "You need a Dynamax Band to Dynamax!", visible: true });
              setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
              return;
           }
      }


      const data = await fetchPokemonData(nextPokedexId);
      if (!data) return;

      let newMultiplier = calculateMultiplier(data.totalStats, pokemon.class);
      if (pokemon.isShiny) newMultiplier *= 1.2;

      setPlayer(prev => {
          const inv = [...prev.inventory];
          const idx = inv.findIndex(p => p.uniqueId === uniqueId);
          if (idx === -1) return prev;

          inv[idx] = {
              ...inv[idx],
              pokedexId: nextPokedexId,
              name: data.name,
              sprite: pokemon.isShiny ? data.shinySprite : data.sprite,
              types: data.types,
              totalStats: data.totalStats,
              multiplier: newMultiplier
          };

          return {
              ...prev,
              credits: prev.credits - cost,
              inventory: inv
          };
      });

      setToast({ message: `Transformed into ${data.name}!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleBuyPokemon = (pokemon: MarketPokemon, cost: number) => {
      setPlayer(prev => ({
          ...prev,
          credits: prev.credits - cost,
          inventory: [...prev.inventory, pokemon],
          stats: {
              ...prev.stats,
              pokemonBought: prev.stats.pokemonBought + 1
          }
      }));
      setMarketItems(prev => prev.filter(i => i.uniqueId !== pokemon.uniqueId));
  };

  const handleBuyItem = (item: GameItem) => {
      if (player.credits < item.price) return;
      
      setPlayer(prev => ({
          ...prev,
          credits: prev.credits - item.price,
          items: [...prev.items, item.id]
      }));
      setToast({ message: `Bought ${item.name}!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleSellPokemon = (id: string, price: number) => {
      // Robust selling logic
      setPlayer(prev => {
          // Check if item actually exists
          const itemExists = prev.inventory.some(p => p.uniqueId === id);
          if (!itemExists) return prev;

          // Remove from inventory
          const newInventory = prev.inventory.filter(p => p.uniqueId !== id);
          // Remove from equipped if present
          const newEquipped = prev.equippedPokemonIds.filter(eId => eId !== id);
          
          return {
              ...prev,
              credits: prev.credits + price,
              inventory: newInventory,
              equippedPokemonIds: newEquipped
          };
      });
      setToast({ message: `Sold for +${price.toLocaleString()} credits!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleSellItem = (itemId: string, price: number) => {
    setPlayer(prev => {
        const itemIndex = prev.items.findIndex(i => i === itemId);
        if (itemIndex === -1) return prev;

        const newItems = [...prev.items];
        newItems.splice(itemIndex, 1);

        return {
            ...prev,
            credits: prev.credits + price,
            items: newItems
        };
    });
    setToast({ message: `Sold item for +${price.toLocaleString()} credits!`, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
  };

  const handleToggleEquip = (id: string) => {
      setPlayer(prev => {
          const isEquipped = prev.equippedPokemonIds.includes(id);
          if (isEquipped) {
              return { ...prev, equippedPokemonIds: prev.equippedPokemonIds.filter(eid => eid !== id) };
          } else {
              if (prev.equippedPokemonIds.length >= 6) return prev;
              return { ...prev, equippedPokemonIds: [...prev.equippedPokemonIds, id] };
          }
      });
  };

  const handleGiveItem = (itemId: string, pokemonId: string) => {
      // COMPATIBILITY CHECK
      // Check if this item has requirements
      // We look if ITEM_REQUIREMENTS has this item ID as a value
      const targetPokemon = player.inventory.find(p => p.uniqueId === pokemonId);
      if (!targetPokemon) return;

      // Find all Pokemon IDs that require this item for something
      const compatiblePokedexIds = Object.keys(ITEM_REQUIREMENTS)
          .filter(key => ITEM_REQUIREMENTS[parseInt(key)] === itemId)
          .map(Number);
      
      // If the item IS a specific requirement item, and the target pokemon is NOT in the compatible list
      if (compatiblePokedexIds.length > 0 && !compatiblePokedexIds.includes(targetPokemon.pokedexId)) {
          setToast({ message: "This item cannot be held by this Pokémon!", visible: true });
          setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
          return;
      }

      setPlayer(prev => {
          const pokemonIndex = prev.inventory.findIndex(p => p.uniqueId === pokemonId);
          if (pokemonIndex === -1) return prev;

          const itemIndex = prev.items.findIndex(i => i === itemId);
          if (itemIndex === -1) return prev;

          const newInventory = [...prev.inventory];
          const targetPokemon = { ...newInventory[pokemonIndex] };
          const newItems = [...prev.items];

          // If pokemon already holds item, return it to bag
          if (targetPokemon.heldItem) {
              newItems.push(targetPokemon.heldItem);
          }

          // Assign new item
          targetPokemon.heldItem = itemId;
          
          // Remove from bag (one instance)
          newItems.splice(itemIndex, 1);

          newInventory[pokemonIndex] = targetPokemon;

          return {
              ...prev,
              inventory: newInventory,
              items: newItems
          };
      });
      setToast({ message: `Equipped item!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
  };

  const handleTakeItem = (pokemonId: string) => {
      setPlayer(prev => {
          const pokemonIndex = prev.inventory.findIndex(p => p.uniqueId === pokemonId);
          if (pokemonIndex === -1) return prev;
          
          const newInventory = [...prev.inventory];
          const targetPokemon = { ...newInventory[pokemonIndex] };
          
          if (!targetPokemon.heldItem) return prev;

          const itemToReturn = targetPokemon.heldItem;
          targetPokemon.heldItem = undefined;
          
          newInventory[pokemonIndex] = targetPokemon;

          return {
              ...prev,
              inventory: newInventory,
              items: [...prev.items, itemToReturn]
          };
      });
      setToast({ message: `Unequipped item!`, visible: true });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 2000);
  };

  // Centralized Credit Update + Stats Tracking
  const updateCredits = (amount: number) => {
    setPlayer(prev => {
        const newCredits = prev.credits + amount;
        const newStats = { ...prev.stats };
        
        // Track Wins
        if (amount > 0) {
            newStats.highestWealth = Math.max(newStats.highestWealth, newCredits);
            if (activeTab === 'roulette') newStats.totalWinsRoulette += 1;
            if (activeTab === 'slots') newStats.totalWinsSlots += 1;
        }

        if (amount < 0 && activeTab === 'rocket') {
            newStats.totalBetsRocket += 1;
        }

        return {
           ...prev,
           credits: newCredits,
           stats: newStats
        };
    });
  };

  const equippedSquad = player.inventory.filter(p => player.equippedPokemonIds.includes(p.uniqueId));

  const getCurrentBonus = (gameType: GameTab): number => {
    const mapGameToBonusType = { 'roulette': 'roulette', 'rocket': 'rocket', 'slots': 'slot' };
    // @ts-ignore
    const requiredType = mapGameToBonusType[gameType];
    if (!requiredType) return 0;

    return equippedSquad.reduce((total, p) => {
        return p.bonusType === requiredType ? total + p.multiplier : total;
    }, 0);
  };

  // Logic to get owned key items for display
  const ownedKeyItems = GAME_ITEMS.filter(
      item => item.category === 'key_item' && player.items.includes(item.id)
  );

  const NAV_ITEMS: { id: GameTab; label: string; icon: string }[] = [
    { id: 'roulette', label: 'Roulette', icon: '🔴' },
    { id: 'rocket', label: 'Rocket', icon: '🚀' },
    { id: 'slots', label: 'Slots', icon: '🎰' },
    { id: 'market', label: 'Market', icon: '🛒' },
    { id: 'collection', label: 'Storage', icon: '🎒' },
    { id: 'achievements', label: 'Awards', icon: '🏆' },
  ];

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  // Render starter selection ONLY if they haven't picked one yet (and it's a new save)
  if (!player.hasPickedStarter) {
    return <StarterSelection onSelect={handleStarterSelect} />;
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Toast Notification */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              {toast.message}
          </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <nav className="glass-panel sticky top-0 z-50 mb-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-start">
          <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => setIsHelpOpen(true)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-600 font-bold hover:bg-white hover:text-black transition-colors"
              >
                  ?
              </button>
              <div className="font-display font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                PokéCassino - Rocket
              </div>
          </div>
          
          {/* Right Side Column */}
          <div className="flex flex-col items-end gap-2">
             {/* Balance Pill */}
             <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="text-yellow-400 text-lg">🪙</span>
                <span className="font-mono font-bold text-lg text-white">
                {player.credits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
             </div>

             {/* Key Items Box */}
             {ownedKeyItems.length > 0 && (
                 <div className="glass-panel p-2 rounded-xl flex flex-wrap justify-end gap-1.5 max-w-[250px] bg-black/40 border-white/5">
                     {ownedKeyItems.map(item => (
                         <div key={item.id} className="w-8 h-8 bg-slate-800 rounded-lg p-1 border border-slate-600 relative group" title={item.name}>
                             <img src={item.sprite} alt={item.name} className="w-full h-full object-contain" />
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4">
        {equippedSquad.length > 0 && (
            <SquadPanel 
              squad={equippedSquad}
              allInventory={player.inventory}
              credits={player.credits}
              playerItems={player.items}
              onEvolve={handleEvolution}
              onFuse={handleFusion}
              onFormChange={handleFormChange}
              onTakeItem={handleTakeItem}
            />
        )}

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 max-w-5xl mx-auto px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative flex flex-col items-center justify-center py-4 rounded-2xl font-bold transition-all border group
                ${
                  activeTab === item.id 
                    ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] -translate-y-1' 
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-white/10'
                }
              `}
            >
              <span className="text-2xl mb-1 filter drop-shadow-lg transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider">{item.label}</span>
              
              {item.id === 'achievements' && (
                  <span className="absolute top-2 right-2 text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-1.5 rounded-full">
                      {player.completedAchievementIds.length}/{ACHIEVEMENTS.length}
                  </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'market' ? (
             <Marketplace 
                credits={player.credits}
                items={marketItems}
                targetTime={marketTargetTime}
                loading={marketLoading}
                onBuy={handleBuyPokemon} 
                onRefresh={handleMarketRefresh}
                filter={marketFilter}
                setFilter={setMarketFilter}
                showFilters={showMarketFilters}
                setShowFilters={setShowMarketFilters}
                ownedItemIds={player.items} // Show as owned ONLY if in bag (so they can buy duplicates if needed, or check logic in Marketplace)
                // Actually Marketplace check logic usually hides owned unique items, but here items are strings.
                // Pass items in bag + items held to be safe if items should be unique globally? 
                // Market logic uses this array to HIDE items. If we want unique items globally:
                // ownedItemIds={[...player.items, ...player.inventory.map(p => p.heldItem).filter(Boolean) as string[]]}
                onBuyItem={handleBuyItem}
             />
        ) : activeTab === 'collection' ? (
             <Collection 
                inventory={player.inventory} 
                equippedIds={player.equippedPokemonIds} 
                playerItems={player.items}
                onToggleEquip={handleToggleEquip}
                onSell={handleSellPokemon}
                onSellItem={handleSellItem}
                onGiveItem={handleGiveItem}
             />
        ) : activeTab === 'achievements' ? (
             <Achievements player={player} />
        ) : (
            <div className="glass-panel rounded-3xl p-8 min-h-[400px] shadow-2xl border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 blur-[100px] rounded-full -z-10"></div>
                
                {activeTab === 'roulette' && (
                    <Roulette 
                    bonusMultiplier={getCurrentBonus('roulette')} 
                    onEndGame={updateCredits} 
                    credits={player.credits} 
                    />
                )}
                {activeTab === 'rocket' && (
                    <Rocket 
                    bonusMultiplier={getCurrentBonus('rocket')} 
                    onEndGame={updateCredits} 
                    credits={player.credits} 
                    />
                )}
                {activeTab === 'slots' && (
                    <Slots 
                    bonusMultiplier={getCurrentBonus('slots')} 
                    onEndGame={updateCredits} 
                    credits={player.credits} 
                    />
                )}

                <div className="mt-8 text-center text-slate-500 text-sm">
                   Active Squad Bonus: <span className="text-emerald-400 font-bold">+{ (getCurrentBonus(activeTab) * 100).toFixed(0) }%</span>
                   <div className="text-xs text-slate-600 mt-1">Based on {equippedSquad.length} equipped Pokémon</div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;