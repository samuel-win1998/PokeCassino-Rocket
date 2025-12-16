import React from 'react';
import { MarketPokemon } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS, GEN1_EVOLUTION_MAP, MEGA_EVOLUTION_MAP, FUSION_PAIRS, FORM_CHAINS } from '../constants';

interface SquadPanelProps {
  squad: MarketPokemon[];
  allInventory: MarketPokemon[];
  credits: number;
  onEvolve: (uniqueId: string, cost: number) => void;
  onFuse: (baseId: string, partnerId: string, resultPokedexId: number, cost: number) => void;
  onFormChange: (uniqueId: string, nextPokedexId: number, cost: number) => void;
}

export const SquadPanel: React.FC<SquadPanelProps> = ({ squad, allInventory, credits, onEvolve, onFuse, onFormChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
        Party <span className="text-sm bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{squad.length}/6</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {squad.map((pokemon) => {
          // 1. Check Standard/Mega Evolution
          let nextStageCost = 0;
          let canEvolve = false;
          let isMega = false;
          let evoLabel = 'Evolve';

          if (GEN1_EVOLUTION_MAP[pokemon.pokedexId]) {
              canEvolve = true;
              nextStageCost = 5000;
          } else if (MEGA_EVOLUTION_MAP[pokemon.pokedexId]) {
              canEvolve = true;
              isMega = true;
              nextStageCost = 50000;
              evoLabel = 'MEGA EVOLVE';
          }

          // 2. Check Fusions (Necrozma, Kyurem, Calyrex)
          // To fuse, the Partner must be in the inventory (can be equipped or unequipped, usually unequipped is safer logic but let's check allInventory)
          // Note: FUSION_PAIRS[pokemon.pokedexId] returns array of options
          const fusionOptions = FUSION_PAIRS[pokemon.pokedexId];
          let availableFusion = null;

          if (fusionOptions) {
              // Find if we have the partner
              for (const option of fusionOptions) {
                  const partner = allInventory.find(p => p.pokedexId === option.partnerId && p.uniqueId !== pokemon.uniqueId);
                  if (partner) {
                      availableFusion = {
                          ...option,
                          partnerUniqueId: partner.uniqueId,
                          cost: 100000 // Fusion Cost
                      };
                      break; // Just show first available for simplicity or could map buttons
                  }
              }
          }

          // 3. Check Form Changes (Zygarde)
          const nextFormId = FORM_CHAINS[pokemon.pokedexId];
          const formChangeCost = 25000;

          return (
            <div key={pokemon.uniqueId} className={`glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden border ${pokemon.isShiny ? 'border-yellow-400' : CLASS_COLORS[pokemon.class].split(' ')[1]}`}>
               {/* Background Glow */}
               <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${pokemon.isShiny ? 'from-yellow-400/20' : 'from-white/10'} to-transparent blur-2xl rounded-full pointer-events-none`} />

               <div className="relative shrink-0">
                  <div className={`w-20 h-20 rounded-full border-2 ${pokemon.isShiny ? 'border-yellow-400' : 'border-white/10'} bg-black/40 flex items-center justify-center p-1`}>
                     <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center rounded text-xs font-black bg-slate-900 border ${CLASS_COLORS[pokemon.class]}`}>
                    {pokemon.class}
                  </div>
               </div>

               <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold truncate ${pokemon.isShiny ? 'text-yellow-400' : 'text-white'}`}>{pokemon.name}</h3>
                        {pokemon.isShiny && <span className="text-xs">✨</span>}
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mb-1">
                        +{(pokemon.multiplier * 100).toFixed(0)}% {pokemon.bonusType}
                    </div>
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
                             disabled={credits < formChangeCost}
                             onClick={() => onFormChange(pokemon.uniqueId, nextFormId, formChangeCost)}
                             className="py-1 px-3 text-xs w-full border border-green-500/50"
                          >
                             Change Form ${formChangeCost.toLocaleString()}
                          </Button>
                      ) : canEvolve ? (
                            <Button 
                              variant={isMega ? 'primary' : 'success'} 
                              disabled={credits < nextStageCost}
                              onClick={() => onEvolve(pokemon.uniqueId, nextStageCost)}
                              className="py-1 px-3 text-xs w-full"
                            >
                              {evoLabel} ${nextStageCost.toLocaleString()}
                            </Button>
                      ) : (
                        <div className="text-xs text-slate-500 italic border border-slate-700/50 rounded px-2 py-1 text-center">
                            Max Potential
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