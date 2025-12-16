import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';

interface RocketProps {
  bonusMultiplier: number;
  onEndGame: (amount: number) => void;
  credits: number;
}

export const Rocket: React.FC<RocketProps> = ({ bonusMultiplier, onEndGame, credits }) => {
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [message, setMessage] = useState('');
  
  // Refs for loop management to avoid closure staleness
  const reqRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  const stateRef = useRef<{ isPlaying: boolean, multiplier: number }>({ isPlaying: false, multiplier: 1.0 });

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const startGame = () => {
    if (credits < bet) return;
    onEndGame(-bet); // Deduct bet
    
    setIsPlaying(true);
    setCrashed(false);
    setMessage('');
    setMultiplier(1.00);
    stateRef.current = { isPlaying: true, multiplier: 1.00 };

    // Determine crash point
    const r = Math.random();
    let crashAt = 1.00;
    if (r < 0.03) crashAt = 1 + Math.random() * 0.05; // Instant crash
    else if (r < 0.5) crashAt = 1 + Math.random(); // 1x - 2x
    else if (r < 0.9) crashAt = 2 + Math.random() * 8; // 2x - 10x
    else crashAt = 10 + Math.random() * 40; // 10x+
    
    crashPointRef.current = crashAt;
    startTimeRef.current = performance.now();
    
    gameLoop();
  };

  const gameLoop = () => {
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000; // seconds
    
    // Exponential growth curve
    const currentMult = 1 + (0.3 * elapsed) + (0.05 * Math.pow(elapsed, 2));
    
    if (currentMult >= crashPointRef.current) {
      handleCrash(crashPointRef.current);
    } else {
      setMultiplier(currentMult);
      stateRef.current.multiplier = currentMult;
      reqRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleCrash = (finalVal: number) => {
    setCrashed(true);
    setIsPlaying(false);
    setMultiplier(finalVal);
    stateRef.current.isPlaying = false;
    setMessage(`💥 Crashed at ${finalVal.toFixed(2)}x`);
  };

  const cashOut = () => {
    if (!stateRef.current.isPlaying) return;
    
    const currentMult = stateRef.current.multiplier;
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    
    setIsPlaying(false);
    stateRef.current.isPlaying = false;
    
    // Correct Formula: Total Payout = (Bet * Multiplier) * (1 + Bonus%)
    // Example: Bet 100, out at 2x. Base Payout = 200. Bonus 10% = 20. Total = 220.
    const basePayout = bet * currentMult;
    const totalPayout = basePayout * (1 + bonusMultiplier);
    
    onEndGame(totalPayout); // Return total payout
    
    setMessage(`🚀 Cashed out at ${currentMult.toFixed(2)}x! (+${totalPayout.toFixed(0)})`);
  };

  // Calculate rocket position based on multiplier for visual
  const rocketBottom = Math.min(80, (multiplier - 1) * 20);
  const rocketLeft = Math.min(80, (multiplier - 1) * 15);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="w-full aspect-video bg-slate-900 rounded-2xl border-2 border-slate-700 relative overflow-hidden mb-6 shadow-inner">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Multiplier Display */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black font-display z-10 ${crashed ? 'text-red-500' : 'text-white'}`}>
          {multiplier.toFixed(2)}x
        </div>

        {/* Rocket Icon */}
        {!crashed && (
          <div 
            className="absolute text-4xl transition-transform duration-75"
            style={{ bottom: `${10 + rocketBottom}%`, left: `${10 + rocketLeft}%`, transform: 'rotate(45deg)' }}
          >
            🚀
          </div>
        )}

        {/* Explosion */}
        {crashed && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse">
             💥
           </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 font-bold text-lg ${crashed ? 'text-red-400' : 'text-emerald-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-slate-800/50 p-6 rounded-2xl w-full border border-white/5 flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-bold text-slate-400 block mb-2">Bet Amount</label>
          <input 
            type="number" 
            min="1" 
            value={bet} 
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 focus:border-violet-500 outline-none"
          />
        </div>
        
        <div className="flex-1">
          {!isPlaying ? (
            <Button variant="primary" fullWidth onClick={startGame} disabled={credits < bet}>
              LAUNCH
            </Button>
          ) : (
            <Button variant="success" fullWidth onClick={cashOut}>
              CASHOUT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};