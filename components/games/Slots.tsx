import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { SLOT_ICONS } from '../../constants';

interface SlotsProps {
  bonusMultiplier: number;
  onEndGame: (amount: number) => void;
  credits: number;
}

export const Slots: React.FC<SlotsProps> = ({ bonusMultiplier, onEndGame, credits }) => {
  const [bet, setBet] = useState(5);
  const [spinning, setSpinning] = useState(false);
  // 3x3 Grid = 9 slots
  const [reels, setReels] = useState<number[]>(Array(9).fill(0)); 
  const [message, setMessage] = useState('');
  const [winLines, setWinLines] = useState<number[][]>([]);

  const getRandomIconIndex = () => {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < SLOT_ICONS.length; i++) {
      acc += SLOT_ICONS[i].chance;
      if (r < acc) return i;
    }
    return SLOT_ICONS.length - 1;
  };

  const spin = () => {
    if (credits < bet || spinning) return;
    onEndGame(-bet);
    setSpinning(true);
    setMessage('');
    setWinLines([]);

    // Visual effect: Random shuffle
    const interval = setInterval(() => {
      setReels(Array(9).fill(0).map(() => Math.floor(Math.random() * SLOT_ICONS.length)));
    }, 100);

    // Stop after 2s
    setTimeout(() => {
      clearInterval(interval);
      const finalGrid = Array(9).fill(0).map(() => getRandomIconIndex());
      setReels(finalGrid);
      setSpinning(false);

      // Check Wins (3x3 logic)
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      let totalWin = 0;
      const winningLines: number[][] = [];
      const winningNames: string[] = [];

      lines.forEach(line => {
          const [a, b, c] = line;
          if (finalGrid[a] === finalGrid[b] && finalGrid[b] === finalGrid[c]) {
              // Match found
              const icon = SLOT_ICONS[finalGrid[a]];
              const lineWin = bet * icon.payout; // Payout per line
              totalWin += lineWin;
              winningLines.push(line);
              if (!winningNames.includes(icon.name)) winningNames.push(icon.name);
          }
      });

      if (totalWin > 0) {
        // Apply Bonus Multiplier once to the total
        const finalPayout = totalWin * (1 + bonusMultiplier);
        onEndGame(finalPayout);
        setWinLines(winningLines);
        setMessage(`BIG WIN! ${winningNames.join(', ')} MATCH! +${finalPayout.toFixed(0)}`);
      } else {
        setMessage('No match, try again!');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="text-4xl mb-2 text-orange-400 font-display font-black tracking-tighter">
        FORTUNE TIGER
      </div>
      
      {/* Slot Machine Display */}
      <div className="bg-gradient-to-b from-yellow-600 to-orange-700 p-3 rounded-3xl shadow-2xl mb-6 border-4 border-yellow-400 w-full relative max-w-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-900 rounded-b-xl z-10 flex items-center justify-center border-b-2 border-yellow-500/50">
          <span className="text-yellow-200 text-xs font-bold tracking-widest">3x3 MULTI-LINE</span>
        </div>
        
        <div className="bg-black/80 rounded-2xl p-4 grid grid-cols-3 gap-2 border-inner shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {reels.map((iconIdx, i) => {
             // Check if this slot is part of a winning line for highlighting
             const isWinner = winLines.some(line => line.includes(i));
             
             return (
                <div 
                    key={i} 
                    className={`aspect-square bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border flex items-center justify-center text-4xl sm:text-5xl shadow-xl overflow-hidden relative ${isWinner ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10' : 'border-slate-700'}`}
                >
                  {spinning && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
                  <span className={`${spinning ? 'blur-sm scale-110' : ''} ${isWinner ? 'animate-bounce' : ''}`}>
                    {SLOT_ICONS[iconIdx].symbol}
                  </span>
                </div>
             );
          })}
        </div>
      </div>

      <div className={`h-8 mb-4 font-bold text-lg text-center ${message.includes('WIN') ? 'text-yellow-400 animate-pulse' : 'text-slate-400'}`}>
        {message}
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl w-full border border-white/5 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-bold text-slate-400 block mb-2">Bet Amount</label>
          <input 
            type="number" 
            min="1" 
            value={bet} 
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={spinning}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 focus:border-violet-500 outline-none"
          />
        </div>
        
        <div className="flex-1">
          <Button variant="danger" fullWidth onClick={spin} disabled={spinning || credits < bet}>
            {spinning ? 'SPINNING...' : 'SPIN'}
          </Button>
        </div>
      </div>
    </div>
  );
};