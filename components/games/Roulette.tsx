import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';

interface RouletteProps {
  bonusMultiplier: number; // 0.1 for 10%
  onEndGame: (amount: number) => void;
  credits: number;
}

type Color = 'red' | 'black' | 'green';

export const Roulette: React.FC<RouletteProps> = ({ bonusMultiplier, onEndGame, credits }) => {
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ color: Color; number: number } | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);

  const NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];
  
  const getNumberColor = (num: number): Color => {
    if (num === 0) return 'green';
    const index = NUMBERS.indexOf(num);
    return index % 2 === 0 ? 'black' : 'red'; // Simplification for visual
  };

  const handleSpin = (selectedColor: Color) => {
    if (credits < bet || isSpinning) return;
    onEndGame(-bet); // Deduct bet immediately

    setIsSpinning(true);
    setResult(null);

    // Randomize
    const randomIndex = Math.floor(Math.random() * NUMBERS.length);
    const winningNumber = NUMBERS[randomIndex];
    const winningColor = getNumberColor(winningNumber);

    // Calculate rotation
    const segmentAngle = 360 / 37;
    const landAngle = randomIndex * segmentAngle; 
    const totalRotation = 1800 + (360 - landAngle); 

    setRotation(prev => prev + totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult({ color: winningColor, number: winningNumber });

      let winMultiplier = 0;
      if (selectedColor === winningColor) {
        if (selectedColor === 'green') winMultiplier = 14;
        else winMultiplier = 2;
      }

      if (winMultiplier > 0) {
        // Correct Formula: Total Payout = (Bet * Multiplier) * (1 + Bonus%)
        const basePayout = bet * winMultiplier;
        const totalPayout = basePayout * (1 + bonusMultiplier);
        onEndGame(totalPayout); 
      }
    }, 3000); // 3s spin
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="relative w-64 h-64 mb-8">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-4xl drop-shadow-lg text-white">▼</div>
        
        {/* Wheel Container */}
        <div 
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden relative transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
           {/* CSS Conic Gradient to simulate wheel segments */}
           <div className="w-full h-full rounded-full" 
                style={{ 
                  background: `conic-gradient(
                    #22c55e 0deg 9.7deg,
                    #ef4444 9.7deg 19.4deg,
                    #1e293b 19.4deg 29.1deg,
                    #ef4444 29.1deg 38.8deg,
                    #1e293b 38.8deg 48.5deg,
                    #ef4444 48.5deg 58.2deg,
                    #1e293b 58.2deg 67.9deg,
                    #ef4444 67.9deg 77.6deg,
                    #1e293b 77.6deg 87.3deg,
                    #ef4444 87.3deg 97deg,
                    #1e293b 97deg 106.7deg,
                    #ef4444 106.7deg 116.4deg,
                    #1e293b 116.4deg 126.1deg,
                    #ef4444 126.1deg 135.8deg,
                    #1e293b 135.8deg 145.5deg,
                    #ef4444 145.5deg 155.2deg,
                    #1e293b 155.2deg 164.9deg,
                    #ef4444 164.9deg 174.6deg,
                    #1e293b 174.6deg 184.3deg,
                    #ef4444 184.3deg 194deg,
                    #1e293b 194deg 203.7deg,
                    #ef4444 203.7deg 213.4deg,
                    #1e293b 213.4deg 223.1deg,
                    #ef4444 223.1deg 232.8deg,
                    #1e293b 232.8deg 242.5deg,
                    #ef4444 242.5deg 252.2deg,
                    #1e293b 252.2deg 261.9deg,
                    #ef4444 261.9deg 271.6deg,
                    #1e293b 271.6deg 281.3deg,
                    #ef4444 281.3deg 291deg,
                    #1e293b 291deg 300.7deg,
                    #ef4444 300.7deg 310.4deg,
                    #1e293b 310.4deg 320.1deg,
                    #ef4444 320.1deg 329.8deg,
                    #1e293b 329.8deg 339.5deg,
                    #ef4444 339.5deg 349.2deg,
                    #1e293b 349.2deg 360deg
                  )` 
                }}
           ></div>
           
           {/* Inner Circle for aesthetics */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full border-2 border-slate-600 z-10 shadow-inner"></div>
        </div>
      </div>

      {result && (
        <div className="mb-4 text-center animate-bounce-subtle">
           <span className="text-sm text-slate-400">Result:</span>
           <div className={`text-2xl font-black uppercase ${
             result.color === 'red' ? 'text-red-500' : 
             result.color === 'black' ? 'text-slate-300' : 'text-emerald-400'
           }`}>
             {result.number} ({result.color})
           </div>
        </div>
      )}

      <div className="bg-slate-800/50 p-6 rounded-2xl w-full border border-white/5">
        <div className="flex items-center justify-between mb-4">
           <label className="text-sm font-bold text-slate-400">Bet Amount</label>
           <input 
             type="number" 
             min="1" 
             value={bet} 
             onChange={(e) => setBet(Number(e.target.value))}
             disabled={isSpinning}
             className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right focus:border-violet-500 outline-none"
           />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
           <Button variant="danger" disabled={isSpinning || credits < bet} onClick={() => handleSpin('red')}>
              RED (x2)
           </Button>
           <Button variant="secondary" disabled={isSpinning || credits < bet} onClick={() => handleSpin('black')}>
              BLACK (x2)
           </Button>
           <Button variant="success" disabled={isSpinning || credits < bet} onClick={() => handleSpin('green')}>
              GREEN (x14)
           </Button>
        </div>
      </div>
    </div>
  );
};