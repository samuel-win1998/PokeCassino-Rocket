import React from 'react';
import { POKEMON_DATA } from '../constants';
import { Button } from './ui/Button';

interface StarterSelectionProps {
  onSelect: (id: string) => void;
}

export const StarterSelection: React.FC<StarterSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 mb-4 text-center">
        PokéCassino - Rocket
      </h1>
      <p className="text-slate-400 text-lg mb-12 text-center max-w-md">
        Choose your partner to begin your journey. Each Pokémon grants a unique bonus to specific casino games.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {Object.entries(POKEMON_DATA).map(([key, data]) => {
           // We use a static image for starters for instant load, or fetch from pokeapi. 
           // For stability, let's use the raw github version
           const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.base.apiName === 'bulbasaur' ? 1 : data.base.apiName === 'charmander' ? 4 : 7}.png`;
           
           return (
             <div key={key} className="glass-panel p-6 rounded-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300 group cursor-pointer border border-white/5 hover:border-violet-500/50" onClick={() => onSelect(key)}>
               <div className="w-32 h-32 mb-4 relative">
                  <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full group-hover:bg-violet-400/40 transition-colors"></div>
                  <img src={img} alt={data.base.name} className="relative z-10 w-full h-full object-contain drop-shadow-2xl" />
               </div>
               <h3 className="text-2xl font-bold font-display text-white mb-6">{data.base.name}</h3>
               <Button variant="primary" fullWidth>Select</Button>
             </div>
           );
        })}
      </div>
    </div>
  );
};