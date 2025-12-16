import React from 'react';
import { MarketPokemon } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS } from '../constants';

interface CollectionProps {
  inventory: MarketPokemon[];
  equippedIds: string[];
  onToggleEquip: (id: string) => void;
}

export const Collection: React.FC<CollectionProps> = ({ inventory, equippedIds, onToggleEquip }) => {
  if (inventory.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        You don't own any Pokémon yet. Visit the Marketplace!
      </div>
    );
  }

  // Sort by Class (A -> F) then by Multiplier
  const sortedInventory = [...inventory].sort((a, b) => {
    const classOrder = { 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 };
    if (classOrder[a.class] !== classOrder[b.class]) {
        return classOrder[b.class] - classOrder[a.class];
    }
    return b.multiplier - a.multiplier;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
        <h3 className="text-slate-300 font-bold">Your Storage</h3>
        <div className={`px-4 py-1 rounded-full text-sm font-bold border ${equippedIds.length === 6 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-emerald-900/50 border-emerald-500 text-emerald-200'}`}>
          Equipped: {equippedIds.length}/6
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedInventory.map((item) => {
           const isEquipped = equippedIds.includes(item.uniqueId);
           return (
             <div 
                key={item.uniqueId} 
                className={`glass-panel p-4 rounded-xl flex flex-col relative transition-all ${
                    isEquipped ? 'ring-2 ring-violet-500 bg-violet-900/20' : ''
                } ${item.isShiny ? 'border-yellow-400/50' : ''}`}
             >
               {/* Class Badge */}
               <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-black bg-slate-900 border ${CLASS_COLORS[item.class]}`}>
                 Class {item.class}
               </div>

               {isEquipped && (
                 <div className="absolute top-2 right-2 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                   EQUIPPED
                 </div>
               )}

               {item.isShiny && (
                   <div className="absolute bottom-20 right-2 text-xl animate-bounce-subtle">✨</div>
               )}

               <div className="w-24 h-24 mx-auto mb-2 mt-4">
                  <img src={item.sprite} alt={item.name} className="w-full h-full object-contain" />
               </div>

               <div className="text-center mb-3">
                 <h3 className={`font-bold ${item.isShiny ? 'text-yellow-400' : 'text-white'}`}>{item.name}</h3>
               </div>

               <div className="bg-slate-900/50 rounded-lg p-2 mb-3 text-xs">
                 <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Bonus Type:</span>
                    <span className="text-white capitalize">{item.bonusType}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400">Multiplier:</span>
                    <span className="text-emerald-400 font-bold">+{(item.multiplier * 100).toFixed(1)}%</span>
                 </div>
               </div>

               <Button 
                 variant={isEquipped ? 'secondary' : 'primary'} 
                 onClick={() => onToggleEquip(item.uniqueId)}
                 className="mt-auto py-2 text-sm"
                 disabled={!isEquipped && equippedIds.length >= 6}
               >
                 {isEquipped ? 'Unequip' : equippedIds.length >= 6 ? 'Full Team' : 'Equip'}
               </Button>
             </div>
           );
        })}
      </div>
    </div>
  );
};