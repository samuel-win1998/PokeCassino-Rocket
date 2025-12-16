import React, { useEffect, useState } from 'react';
import { MarketPokemon, MarketFilter, PokemonClass, BonusType, PokemonType, PokemonGroup } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS, TYPE_COLORS } from '../constants';
import { calculateRefreshCost } from '../utils/marketGenerator';

interface MarketplaceProps {
  credits: number;
  items: MarketPokemon[];
  targetTime: number; 
  loading: boolean;
  onBuy: (pokemon: MarketPokemon, cost: number) => void;
  onRefresh: (filter: MarketFilter, isPaid: boolean) => void;
  // Props for lifted state
  filter: MarketFilter;
  setFilter: React.Dispatch<React.SetStateAction<MarketFilter>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
    credits, items, targetTime, loading, onBuy, onRefresh,
    filter, setFilter, showFilters, setShowFilters
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Dynamic Cost Calculation
  const refreshCost = calculateRefreshCost(filter);

  useEffect(() => {
    const updateTimer = () => {
        const now = Date.now();
        const diff = Math.ceil((targetTime - now) / 1000);
        
        if (diff <= 0) {
            if (!loading) {
               onRefresh(filter, false); 
            }
            setTimeLeft(0);
        } else {
            setTimeLeft(diff);
        }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetTime, loading, onRefresh, filter]);

  const toggleType = (type: PokemonType) => {
    setFilter(prev => {
        const currentTypes = prev.targetType;
        if (currentTypes.includes(type)) {
            return { ...prev, targetType: currentTypes.filter(t => t !== type) };
        } else {
            return { ...prev, targetType: [...currentTypes, type] };
        }
    });
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="bg-slate-800/80 p-6 rounded-2xl border border-white/5 shadow-xl">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div>
                <h2 className="text-2xl font-display font-bold text-white">Marketplace</h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>New Stock in:</span>
                    <span className="font-mono text-xl font-bold text-yellow-400">{Math.max(0, timeLeft)}s</span>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="text-sm py-2">
                   {showFilters ? 'Hide Search' : 'Advanced Search'}
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={() => onRefresh(filter, true)} 
                    disabled={loading || credits < refreshCost} 
                    className="text-sm py-2 px-4 flex items-center justify-center gap-2"
                >
                    Force Refresh 
                    <span className={`font-mono text-xs ${credits < refreshCost ? 'text-red-500' : 'text-red-300'}`}>
                        (-${refreshCost.toLocaleString()})
                    </span>
                </Button>
            </div>
         </div>

         {/* Advanced Filter UI */}
         {showFilters && (
             <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 transition-all space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Generation Filter */}
                    <div>
                         <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Generation</label>
                         <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white"
                            value={filter.targetGen}
                            onChange={(e) => setFilter({...filter, targetGen: e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value)})}
                         >
                             <option value="ALL">All Generations</option>
                             {[1,2,3,4,5,6,7,8,9].map(g => <option key={g} value={g}>Gen {g} (+5k)</option>)}
                         </select>
                    </div>

                    {/* Group Filter */}
                    <div>
                         <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Group</label>
                         <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white"
                            value={filter.targetGroup}
                            onChange={(e) => setFilter({...filter, targetGroup: e.target.value as PokemonGroup})}
                         >
                             <option value="ALL">All Groups</option>
                             <option value="starter">Starters (+1k)</option>
                             <option value="pseudo">Pseudo-Legendaries (+5k)</option>
                             <option value="paradox">Paradox Pokémon (+10k)</option>
                             <option value="ultrabeast">Ultra Beasts (+15k)</option>
                             <option value="mythical">Mythicals (+20k)</option>
                             <option value="legendary">Legendaries (+25k)</option>
                         </select>
                    </div>
                </div>

                {/* Type Filter */}
                <div>
                     <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Types (Select Multiple) <span className="text-red-400 ml-2">(+5,000 cost)</span></label>
                     <div className="flex flex-wrap gap-2">
                        {Object.keys(TYPE_COLORS).map(typeKey => {
                            const type = typeKey as PokemonType;
                            const isSelected = filter.targetType.includes(type);
                            return (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                        isSelected 
                                            ? `${TYPE_COLORS[type]} text-white border-white/50 shadow-lg scale-105` 
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            );
                        })}
                        {filter.targetType.length > 0 && (
                            <button 
                                onClick={() => setFilter(prev => ({ ...prev, targetType: [] }))}
                                className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-red-900/50 text-red-400 hover:text-red-300"
                            >
                                Clear Types
                            </button>
                        )}
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Class Filter Cost</label>
                        <div className="flex flex-wrap gap-2">
                            {(['ALL', 'F', 'E', 'D', 'C', 'B', 'A'] as const).map(c => {
                                let costLabel = '';
                                if(c === 'F') costLabel = '-500';
                                else if(c === 'E' || c === 'ALL') costLabel = '';
                                else if(c === 'D') costLabel = '+1k';
                                else if(c === 'C') costLabel = '+5k';
                                else if(c === 'B') costLabel = '+10k';
                                else if(c === 'A') costLabel = '+25k';
                                
                                return (
                                    <button 
                                        key={c}
                                        onClick={() => setFilter(prev => ({ ...prev, targetClass: c as PokemonClass | 'ALL' }))}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex flex-col items-center ${filter.targetClass === c ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        <span>{c}</span>
                                        {costLabel && <span className={`text-[9px] ${c === 'F' ? 'text-green-400' : 'text-red-300'}`}>{costLabel}</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1 uppercase font-bold">Bonus Filter Cost</label>
                        <div className="flex flex-wrap gap-2">
                            {(['ALL', 'roulette', 'rocket', 'slot'] as const).map(b => (
                                <button 
                                    key={b}
                                    onClick={() => setFilter(prev => ({ ...prev, targetBonus: b as BonusType | 'ALL' }))}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex flex-col items-center ${filter.targetBonus === b ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    <span>{b === 'ALL' ? 'Any' : b.charAt(0).toUpperCase() + b.slice(1)}</span>
                                    {b !== 'ALL' && <span className="text-[9px] text-red-300">+5k</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
         )}
       </div>

       {loading ? (
         <div className="flex justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
         </div>
       ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {items.map((item) => (
             <div 
                key={item.uniqueId} 
                className={`glass-panel p-4 rounded-xl flex flex-col relative group transition-all hover:-translate-y-1 border-2 ${
                    item.isShiny ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] bg-gradient-to-br from-yellow-900/30 to-slate-900' : 
                    CLASS_COLORS[item.class].split(' ')[1].replace('border-', 'border-opacity-50 hover:border-opacity-100 border-')
                }`}
             >
               {/* Class Badge */}
               <div className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg font-black bg-slate-900 border ${CLASS_COLORS[item.class]}`}>
                 {item.class}
               </div>

               {/* Shiny Badge */}
               {item.isShiny && (
                   <div className="absolute top-2 right-12 animate-pulse text-lg" title="Shiny Pokemon (+20% Bonus)">
                       ✨
                   </div>
               )}

               {/* Types */}
               <div className="absolute top-2 left-2 flex gap-1">
                   {item.types.map(t => (
                       <div key={t} className={`w-3 h-3 rounded-full ${TYPE_COLORS[t]} shadow-sm`} title={t}></div>
                   ))}
               </div>

               <div className="w-24 h-24 mx-auto mb-2 relative mt-4">
                  <div className={`absolute inset-0 blur-xl opacity-30 rounded-full ${item.class === 'A' || item.isShiny ? 'bg-yellow-500' : 'bg-white'}`}></div>
                  <img src={item.sprite} alt={item.name} className="relative w-full h-full object-contain" />
               </div>

               <div className="text-center mb-3">
                 <h3 className={`font-bold leading-tight ${item.isShiny ? 'text-yellow-400' : 'text-white'}`}>{item.name}</h3>
                 <div className="text-xs text-slate-400">Total Stats: {item.totalStats}</div>
               </div>

               <div className="bg-slate-900/50 rounded-lg p-2 mb-3 space-y-1">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Bonus:</span>
                   <span className="text-white capitalize">{item.bonusType}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Power:</span>
                   <span className="text-emerald-400 font-bold">
                       +{(item.multiplier * 100).toFixed(1)}% 
                       {item.isShiny && <span className="text-yellow-400 ml-1">✨</span>}
                   </span>
                 </div>
               </div>

               <Button 
                 variant={credits >= item.price ? (item.isShiny ? 'primary' : 'primary') : 'secondary'} 
                 disabled={credits < item.price}
                 onClick={() => {
                   onBuy(item, item.price);
                 }}
                 className={`mt-auto py-2 text-sm ${item.isShiny && credits >= item.price ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white' : ''}`}
               >
                 {credits >= item.price ? `Buy $${item.price.toLocaleString()}` : 'Too Expensive'}
               </Button>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};