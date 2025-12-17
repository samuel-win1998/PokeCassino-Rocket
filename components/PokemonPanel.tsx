import React, { useEffect, useState } from 'react';
import { MarketPokemon } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS, MEGA_EVOLUTION_MAP, FUSION_PAIRS, FORM_CHAINS, ITEM_REQUIREMENTS, GAME_ITEMS, TYPE_COLORS, FUSION_ITEM_REQUIREMENTS, FORM_OPTIONS } from '../constants';
import { getNextEvolution } from '../utils/marketGenerator';

interface SquadPanelProps {
  squad: MarketPokemon[];
  allInventory: MarketPokemon[];
  credits: number;
  playerItems?: string[]; // Bag items for checking Key Items
  onEvolve: (uniqueId: string, cost: number) => void;
  onFuse: (baseId: string, partnerId: string, resultPokedexId: number, cost: number) => void;
  onFormChange: (uniqueId: string, nextPokedexId: number, cost: number) => void;
  onTakeItem?: (pokemonId: string) => void;
}

export const SquadPanel: React.FC<SquadPanelProps> = ({ squad, allInventory, credits, playerItems = [], onEvolve, onFuse, onFormChange, onTakeItem }) => {
  const [canEvolveMap, setCanEvolveMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check evolution status for squad members asynchronously
    const checkEvolutions = async () => {
        const newMap: Record<string, boolean> = {};
        
        for (const p of squad) {
            if (!MEGA_EVOLUTION_MAP[p.pokedexId] && !FORM_CHAINS[p.pokedexId] && !FUSION_PAIRS[p.pokedexId] && !FORM_OPTIONS[p.pokedexId]) {
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
          
          // 1. Check Fusions
          const fusionOptions = FUSION_PAIRS[pokemon.pokedexId];
          let availableFusion = null;
          let fusionMissingKeyItem = '';

          if (fusionOptions) {
              for (const option of fusionOptions) {
                  const partner = allInventory.find(p => p.pokedexId === option.partnerId && p.uniqueId !== pokemon.uniqueId);
                  if (partner) {
                      const requiredItem = FUSION_ITEM_REQUIREMENTS[option.resultId] || 'dna_splicers';
                      if (!playerItems.includes(requiredItem)) {
                          fusionMissingKeyItem = getItemName(requiredItem);
                      }

                      availableFusion = {
                          ...option,
                          partnerUniqueId: partner.uniqueId,
                          cost: 100000
                      };
                      break; 
                  }
              }
          }

          // 2. Check Complex Options (Mega / GMax / Form Choices)
          // This takes precedence over simple Mega maps
          const formOptions = FORM_OPTIONS[pokemon.pokedexId];

          // 3. Check Standard/Legacy Evolution
          let nextStageCost = 5000;
          let evoLabel = 'Evolve';
          let legacyMegaMissingItem = '';
          const showStandardEvolve = !formOptions && !availableFusion && (canEvolveMap[pokemon.uniqueId] || MEGA_EVOLUTION_MAP[pokemon.pokedexId] || FORM_CHAINS[pokemon.pokedexId]);
          
          // Legacy Mega/Form Check (if not in FORM_OPTIONS)
          if (showStandardEvolve) {
              if (MEGA_EVOLUTION_MAP[pokemon.pokedexId]) {
                nextStageCost = 0;
                evoLabel = 'MEGA EVOLVE';
                const requiredStone = ITEM_REQUIREMENTS[pokemon.pokedexId];
                if (requiredStone && pokemon.heldItem !== requiredStone) {
                    legacyMegaMissingItem = getItemName(requiredStone);
                } else if (!playerItems.includes('mega_bracelet')) {
                    legacyMegaMissingItem = "Mega Bracelet";
                }
              } else if (FORM_CHAINS[pokemon.pokedexId]) {
                 nextStageCost = 0;
                 evoLabel = 'Transform';
                 // Check held item req for form chain
                 const reqItem = ITEM_REQUIREMENTS[pokemon.pokedexId];
                 if (reqItem && pokemon.heldItem !== reqItem) {
                     legacyMegaMissingItem = getItemName(reqItem);
                 }
                 // Check Key Items (Legacy linear chain fallback)
                 const nextId = FORM_CHAINS[pokemon.pokedexId];
                 if (nextId === 10157 && !playerItems.includes('z_ring')) legacyMegaMissingItem = 'Z-Power Ring';
                 if (nextId === 10190 && !playerItems.includes('dynamax_band')) legacyMegaMissingItem = 'Dynamax Band';
              }
          }

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
                        <div className="flex gap-1 mt-1">
                            {pokemon.types.map(t => (
                                <div key={t} className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[t]} shadow-sm`} title={t}></div>
                            ))}
                            <span className="text-[10px] text-slate-400 ml-1">BST: {pokemon.totalStats}</span>
                        </div>
                    </div>
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
                      {/* 1. Fusion Button */}
                      {availableFusion && (
                          <Button 
                             variant="primary"
                             disabled={credits < availableFusion.cost || !!fusionMissingKeyItem}
                             onClick={() => onFuse(pokemon.uniqueId, availableFusion!.partnerUniqueId, availableFusion!.resultId, availableFusion!.cost)}
                             className="py-1 px-3 text-xs w-full bg-indigo-600 hover:bg-indigo-500"
                          >
                             {fusionMissingKeyItem ? `Need ${fusionMissingKeyItem}` : `Fuse into ${availableFusion.name} $${availableFusion.cost.toLocaleString()}`}
                          </Button>
                      )}

                      {/* 2. Complex Form Buttons (G-Max, Multiple Megas, Hoopa) */}
                      {formOptions && formOptions.map(opt => {
                          let missing = '';
                          
                          // Check Held Item
                          if (opt.requiredHeldItem && pokemon.heldItem !== opt.requiredHeldItem) {
                              missing = getItemName(opt.requiredHeldItem);
                          }
                          // Check Key Item
                          if (opt.requiredKeyItem && !playerItems.includes(opt.requiredKeyItem)) {
                              missing = getItemName(opt.requiredKeyItem);
                          }

                          return (
                            <Button 
                                key={opt.id}
                                variant={opt.type === 'gmax' ? 'danger' : 'primary'}
                                disabled={!!missing}
                                onClick={() => onFormChange(pokemon.uniqueId, opt.id, 0)}
                                className={`py-1 px-3 text-xs w-full ${opt.type === 'gmax' ? 'bg-gradient-to-r from-red-600 to-pink-600' : ''}`}
                            >
                                {missing ? `Need ${missing}` : opt.name}
                            </Button>
                          );
                      })}

                      {/* 3. Legacy/Standard Evolve Button */}
                      {showStandardEvolve && !formOptions && (
                          <Button 
                            variant={MEGA_EVOLUTION_MAP[pokemon.pokedexId] ? 'primary' : 'success'} 
                            disabled={credits < nextStageCost || !!legacyMegaMissingItem}
                            onClick={() => {
                                if (FORM_CHAINS[pokemon.pokedexId]) {
                                    onFormChange(pokemon.uniqueId, FORM_CHAINS[pokemon.pokedexId], 0);
                                } else {
                                    onEvolve(pokemon.uniqueId, nextStageCost);
                                }
                            }}
                            className="py-1 px-3 text-xs w-full"
                          >
                             {legacyMegaMissingItem ? `Need ${legacyMegaMissingItem}` : `${evoLabel} ${nextStageCost > 0 ? `$${nextStageCost.toLocaleString()}` : ''}`}
                          </Button>
                      )}

                      {/* 4. Max Level Text */}
                      {!availableFusion && !formOptions && !showStandardEvolve && (
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
