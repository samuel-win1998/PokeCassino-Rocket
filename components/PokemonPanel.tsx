import React, { useEffect, useState } from 'react';
import { MarketPokemon } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS, MEGA_EVOLUTION_MAP, FUSION_PAIRS, FORM_CHAINS, ITEM_REQUIREMENTS, GAME_ITEMS, TYPE_COLORS } from '../constants';
import { getNextEvolution } from '../utils/marketGenerator';

interface SquadPanelProps {
  squad: MarketPokemon[];
  allInventory: MarketPokemon[];
  credits: number;
  onEvolve: (uniqueId: string, cost: number) => void;
  onFuse: (baseId: string, partnerId: string, resultPokedexId: number, cost: number) => void;
  onFormChange: (uniqueId: string, nextPokedexId: number, cost: number) => void;
  onTakeItem?: (pokemonId: string) => void;
}

export const SquadPanel: React.FC<SquadPanelProps> = ({ squad, allInventory, credits, onEvolve, onFuse, onFormChange, onTakeItem }) => {
  const [canEvolveMap, setCanEvolveMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check evolution status for squad members asynchronously
    const checkEvolutions = async () => {
        const newMap: Record<string, boolean> = {};
        
        for (const p of squad) {
            if (!MEGA_EVOLUTION_MAP[p.pokedexId] && !FORM_CHAINS[p.pokedexId] && !FUSION_PAIRS[p.pokedexId]) {
                const next = await getNextEvolution(p.pokedexId);
                newMap[p.uniqueId] = !!next;
            }
        }
        setCanEvolveMap(prev => ({...prev, ...newMap}));
    };

    checkEvolutions();
  }, [squad]);

  const getItemName = (id: string) => GAME_ITEMS.find(i => i.id === id)?.name || id;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
        Party <span className="text-sm bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{squad.length}/6</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {squad.map((pokemon) => {
          // 1. Check Standard/Mega Evolution
          let nextStageCost = 5000;
          let evoLabel = 'Evolve';
          let isMega = false;
          let missingItem = '';

          // Check if item required for regular/mega
          const reqItem = ITEM_REQUIREMENTS[pokemon.pokedexId];

          // Check for Mega
          if (MEGA_EVOLUTION_MAP[pokemon.pokedexId]) {
              isMega = true;
              nextStageCost = 0; // Megas now rely on item ownership primarily, cost is negligible or zero if using stone
              evoLabel = 'MEGA EVOLVE';
          }

          // 2. Check Fusions (Necrozma, Kyurem, Calyrex)
          const fusionOptions = FUSION_PAIRS[pokemon.pokedexId];
          let availableFusion = null;

          if (fusionOptions) {
              for (const option of fusionOptions) {
                  const partner = allInventory.find(p => p.pokedexId === option.partnerId && p.uniqueId !== pokemon.uniqueId);
                  if (partner) {
                      availableFusion = {
                          ...option,
                          partnerUniqueId: partner.uniqueId,
                          cost: 100000 // Fusion Cost
                      };
                      break;
                  }
              }
          }

          // 3. Check Form Changes (Linear, One-Way)
          const nextFormId = FORM_CHAINS[pokemon.pokedexId];
          const formChangeCost = 0; // Form changes usually item based now

          // Determine missing items. Logic: The POKEMON must hold the item.
          if (reqItem && pokemon.heldItem !== reqItem) {
              missingItem = getItemName(reqItem);
          }

          // Determine if we show standard evolve button
          // Show if: Is Mega OR (Not Mega/Form/Fusion AND API says can evolve)
          const showEvolve = isMega || (!nextFormId && !availableFusion && canEvolveMap[pokemon.uniqueId]);
          
          return (
            <div key={pokemon.uniqueId} className={`glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden border ${pokemon.isShiny ? 'border-yellow-400' : CLASS_COLORS[pokemon.class].split(' ')[1]}`}>
               {/* Background Glow */}
               <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${pokemon.isShiny ? 'from-yellow-400/20' : 'from-white/10'} to-transparent blur-2xl rounded-full pointer-events-none`} />

               <div className="relative shrink-0 group/img">
                  <div className={`w-20 h-20 rounded-full border-2 ${pokemon.isShiny ? 'border-yellow-400' : 'border-white/10'} bg-black/40 flex items-center justify-center p-1`}>
                     <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center rounded text-xs font-black bg-slate-900 border ${CLASS_COLORS[pokemon.class]}`}>
                    {pokemon.class}
                  </div>
               </div>

               <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold truncate ${pokemon.isShiny ? 'text-yellow-400' : 'text-white'}`}>{pokemon.name}</h3>
                            {pokemon.isShiny && <span className="text-xs">✨</span>}
                        </div>
                        {/* Types */}
                        <div className="flex gap-1 mt-1">
                            {pokemon.types.map(t => (
                                <div key={t} className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[t]} shadow-sm`} title={t}></div>
                            ))}
                            <span className="text-[10px] text-slate-400 ml-1">BST: {pokemon.totalStats}</span>
                        </div>
                    </div>
                    {/* Held Item */}
                    {pokemon.heldItem && (
                        <button 
                            onClick={() => onTakeItem && onTakeItem(pokemon.uniqueId)}
                            className="w-8 h-8 bg-black/50 rounded-lg border border-slate-600 hover:border-red-500 hover:bg-red-900/30 transition-colors flex items-center justify-center p-1 relative group"
                            title={`Held: ${getItemName(pokemon.heldItem)}. Click to remove.`}
                        >
                            <img src={GAME_ITEMS.find(i => i.id === pokemon.heldItem)?.sprite} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-500 font-bold text-lg">×</div>
                        </button>
                    )}
                  </div>
                  
                  <div className="text-xs text-emerald-400 font-bold mb-1">
                      +{(pokemon.multiplier * 100).toFixed(0)}% {pokemon.bonusType}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                      {availableFusion ? (
                          <Button 
                             variant="primary"
                             disabled={credits < availableFusion.cost}
                             onClick={() => onFuse(pokemon.uniqueId, availableFusion.partnerUniqueId, availableFusion.resultId, availableFusion.cost)}
                             className="py-1 px-3 text-xs w-full bg-indigo-600 hover:bg-indigo-500"
                          >
                             Fuse into {availableFusion.name} ${availableFusion.cost.toLocaleString()}
                          </Button>
                      ) : nextFormId ? (
                          <Button 
                             variant="secondary"
                             disabled={!!missingItem}
                             onClick={() => onFormChange(pokemon.uniqueId, nextFormId, formChangeCost)}
                             className="py-1 px-3 text-xs w-full border border-green-500/50"
                          >
                             {missingItem ? `Give ${missingItem}` : 'Change Form'}
                          </Button>
                      ) : showEvolve ? (
                          <Button 
                            variant={isMega ? 'primary' : 'success'} 
                            disabled={credits < nextStageCost || !!missingItem}
                            onClick={() => onEvolve(pokemon.uniqueId, nextStageCost)}
                            className="py-1 px-3 text-xs w-full"
                          >
                             {missingItem ? `Give ${missingItem}` : `${evoLabel} ${nextStageCost > 0 ? `$${nextStageCost.toLocaleString()}` : ''}`}
                          </Button>
                      ) : (
                          <div className="text-center">
                            <span className="text-xs text-slate-500 font-mono border border-slate-800 px-2 py-1 rounded">MAX LEVEL</span>
                          </div>
                      )}
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};