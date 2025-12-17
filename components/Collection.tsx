import React, { useState } from 'react';
import { MarketPokemon, GameItem } from '../types';
import { Button } from './ui/Button';
import { CLASS_COLORS, CLASS_FIXED_MULTIPLIERS, GAME_ITEMS } from '../constants';

interface CollectionProps {
  inventory: MarketPokemon[];
  equippedIds: string[];
  playerItems?: string[]; // Bag items
  onToggleEquip: (id: string) => void;
  onSell: (id: string, price: number) => void;
  onGiveItem?: (itemId: string, pokemonId: string) => void;
}

export const Collection: React.FC<CollectionProps> = ({ inventory, equippedIds, playerItems = [], onToggleEquip, onSell, onGiveItem }) => {
  const [activeTab, setActiveTab] = useState<'pokemon' | 'items'>('pokemon');
  const [confirmSellId, setConfirmSellId] = useState<string | null>(null);
  
  // State for equipping items logic
  const [selectedItemToEquip, setSelectedItemToEquip] = useState<string | null>(null);

  // Helper to sort inventory
  const sortedInventory = [...inventory].sort((a, b) => {
    const classOrder = { 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1 };
    if (classOrder[a.class] !== classOrder[b.class]) {
        return classOrder[b.class] - classOrder[a.class];
    }
    return b.multiplier - a.multiplier;
  });

  const handleItemEquipClick = (itemId: string) => {
      if (selectedItemToEquip === itemId) {
          setSelectedItemToEquip(null);
      } else {
          setSelectedItemToEquip(itemId);
      }
  };

  const executeEquip = (pokemonId: string) => {
      if (selectedItemToEquip && onGiveItem) {
          onGiveItem(selectedItemToEquip, pokemonId);
          setSelectedItemToEquip(null);
      }
  };

  // Resolve item details for Bag
  const bagItems = playerItems.map(id => GAME_ITEMS.find(i => i.id === id)).filter(Boolean) as GameItem[];
  // Deduplicate for display if needed, but array allows multiples. Let's group by quantity visually or just list.
  // Grouping:
  const groupedItems: { item: GameItem, count: number }[] = [];
  bagItems.forEach(item => {
      const existing = groupedItems.find(g => g.item.id === item.id);
      if (existing) existing.count++;
      else groupedItems.push({ item, count: 1 });
  });

  if (inventory.length === 0 && activeTab === 'pokemon') {
    return (
      <div className="text-center py-20 text-slate-500">
        You don't own any Pokémon yet. Visit the Marketplace!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
        <div className="flex gap-2">
            <button 
                onClick={() => { setActiveTab('pokemon'); setSelectedItemToEquip(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pokemon' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                Pokémon ({inventory.length})
            </button>
            <button 
                onClick={() => { setActiveTab('items'); setSelectedItemToEquip(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'items' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                Items ({playerItems.length})
            </button>
        </div>
        
        {activeTab === 'pokemon' && (
            <div className={`px-4 py-1 rounded-full text-sm font-bold border ${equippedIds.length === 6 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-emerald-900/50 border-emerald-500 text-emerald-200'}`}>
            Party: {equippedIds.length}/6
            </div>
        )}
      </div>

      {/* ITEM SELECTION MODE BANNER */}
      {selectedItemToEquip && (
          <div className="sticky top-20 z-40 bg-indigo-900/90 backdrop-blur border border-indigo-500 p-4 rounded-xl flex justify-between items-center animate-pulse shadow-2xl">
              <div className="flex items-center gap-3">
                  <img src={GAME_ITEMS.find(i => i.id === selectedItemToEquip)?.sprite} className="w-8 h-8" alt="" />
                  <span className="font-bold text-white">Select a Pokémon to give {GAME_ITEMS.find(i => i.id === selectedItemToEquip)?.name}</span>
              </div>
              <button onClick={() => setSelectedItemToEquip(null)} className="text-sm bg-black/30 px-3 py-1 rounded hover:bg-black/50">Cancel</button>
          </div>
      )}

      {activeTab === 'items' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupedItems.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500 italic">No items in bag.</div>
              ) : (
                  groupedItems.map(({ item, count }) => (
                      <div key={item.id} className="glass-panel p-4 rounded-xl flex items-center gap-3 relative">
                          <div className="w-16 h-16 bg-black/40 rounded-lg flex items-center justify-center p-2 border border-slate-700">
                             <img src={item.sprite} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-amber-400 truncate">{item.name}</h3>
                              <p className="text-xs text-slate-400 mb-2">Quantity: {count}</p>
                              <Button 
                                variant="primary" 
                                className="w-full text-xs py-1"
                                onClick={() => {
                                    setSelectedItemToEquip(item.id);
                                    setActiveTab('pokemon'); // Switch tab to allow selection
                                }}
                              >
                                  Give to Pokémon
                              </Button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}

      {activeTab === 'pokemon' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedInventory.map((item) => {
            const isEquipped = equippedIds.includes(item.uniqueId);
            const isConfirming = confirmSellId === item.uniqueId;
            
            // Calculate price for old saves (where price was 0 for starters)
            let baseValue = item.price;
            if (!baseValue && item.isStarter) {
                const rawPrice = item.totalStats * 10;
                const classMult = CLASS_FIXED_MULTIPLIERS[item.class];
                baseValue = Math.floor(rawPrice * classMult * 2);
            }
            
            const sellPrice = Math.floor((baseValue || 1000) * 0.75);
            
            // Selection Mode Overrides
            if (selectedItemToEquip) {
                return (
                    <div 
                        key={item.uniqueId}
                        onClick={() => executeEquip(item.uniqueId)}
                        className={`glass-panel p-4 rounded-xl cursor-pointer transition-all hover:scale-105 border-2 border-indigo-500 bg-indigo-900/20`}
                    >
                         <div className="flex items-center gap-4">
                             <img src={item.sprite} className="w-16 h-16" alt={item.name} />
                             <div>
                                 <h3 className="font-bold text-white">{item.name}</h3>
                                 <span className="text-xs text-indigo-300">Click to Give Item</span>
                             </div>
                         </div>
                    </div>
                )
            }
            
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
                
                {item.heldItem && (
                    <div className="absolute top-10 right-2 w-8 h-8 bg-black/60 rounded-full border border-slate-500 flex items-center justify-center p-1" title={GAME_ITEMS.find(i => i.id === item.heldItem)?.name}>
                        <img src={GAME_ITEMS.find(i => i.id === item.heldItem)?.sprite} className="w-full h-full object-contain" />
                    </div>
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

                <div className="mt-auto flex gap-2">
                    <Button 
                        variant={isEquipped ? 'secondary' : 'primary'} 
                        onClick={() => onToggleEquip(item.uniqueId)}
                        className="flex-1 py-2 text-xs"
                        disabled={!isEquipped && equippedIds.length >= 6}
                    >
                        {isEquipped ? 'Unequip' : 'Equip'}
                    </Button>
                    
                    <Button 
                            variant={isConfirming ? "danger" : "secondary"}
                            onClick={() => {
                                if (isConfirming) {
                                    onSell(item.uniqueId, sellPrice);
                                    setConfirmSellId(null);
                                } else {
                                    setConfirmSellId(item.uniqueId);
                                    setTimeout(() => setConfirmSellId(null), 3000);
                                }
                            }}
                            className={`py-2 px-3 text-xs transition-all ${isConfirming ? 'animate-pulse font-bold' : ''}`}
                        >
                            {isConfirming ? 'CONFIRM?' : `$${sellPrice.toLocaleString()}`}
                    </Button>
                </div>
                </div>
            );
            })}
        </div>
      )}
    </div>
  );
};