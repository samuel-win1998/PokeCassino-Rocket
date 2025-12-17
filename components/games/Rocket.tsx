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
  
  // Container dimensions for SVG line calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Refs for loop management
  const reqRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  const stateRef = useRef<{ isPlaying: boolean, multiplier: number }>({ isPlaying: false, multiplier: 1.0 });

  useEffect(() => {
    const updateDimensions = () => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        }
    };

    updateDimensions();
    // Small delay to ensure layout is stable
    setTimeout(updateDimensions, 100);

    window.addEventListener('resize', updateDimensions);
    return () => {
        window.removeEventListener('resize', updateDimensions);
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
    
    // Slow Burn Growth Curve
    const currentMult = 1 + (0.1 * elapsed) + (0.01 * Math.pow(elapsed, 2.5));
    
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
    setMessage(`Crashed at ${finalVal.toFixed(2)}x`);
  };

  const cashOut = () => {
    if (!stateRef.current.isPlaying) return;
    
    const currentMult = stateRef.current.multiplier;
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    
    setIsPlaying(false);
    stateRef.current.isPlaying = false;
    
    // Correct Formula: Total Payout = (Bet * Multiplier) * (1 + Bonus%)
    const basePayout = bet * currentMult;
    const totalPayout = basePayout * (1 + bonusMultiplier);
    
    onEndGame(totalPayout); // Return total payout
    
    setMessage(`Cashed out at ${currentMult.toFixed(2)}x! (+${totalPayout.toFixed(0)})`);
  };

  // Rocket Position Logic
  const animationStep = Math.min(100, (multiplier - 1) * 25);
  
  // Clamping (ensure we don't go off screen regardless of size)
  // Padding: 40px (left/bottom) + 48px (rocket size) + buffer
  const safeWidth = Math.max(100, dimensions.width - 120);
  const safeHeight = Math.max(100, dimensions.height - 120);
  
  // Trajectory: 4x, 3y (Diagonal ~37 degrees)
  const rawX = animationStep * 4;
  const rawY = animationStep * 3;

  const currentX = Math.min(safeWidth, rawX);
  const currentY = Math.min(safeHeight, rawY);

  // Line Coordinates
  // CSS Position: bottom-10 (40px) left-10 (40px).
  // Rocket Size: text-5xl (~48px). Center is ~24px offset.
  // We want the line to start from the "Launchpad" center
  const launchPadX = 40 + 24; 
  const launchPadY = dimensions.height - (40 + 24);

  // End Point: Rocket Tail.
  // Rocket Center Position relative to SVG origin (0,0 top-left)
  // X = launchPadX + currentX
  // Y = launchPadY - currentY
  const rocketCx = launchPadX + currentX;
  const rocketCy = launchPadY - currentY;

  // Offset to find the "Tail" of the emoji (Bottom-Left of the emoji box)
  // Emoji is naturally diagonal, so tail is roughly -12px X and +12px Y (down-left) from center
  const tailX = rocketCx - 15;
  const tailY = rocketCy + 15;

  const startLineX = launchPadX - 15;
  const startLineY = launchPadY + 15;

  // Determine if we are in the "Result" state (Crashed or Cashed Out)
  const isResultState = !isPlaying && multiplier > 1.0;

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div 
        ref={containerRef}
        className="w-full aspect-video bg-slate-900 rounded-2xl border-2 border-slate-700 relative overflow-hidden mb-6 shadow-inner"
      >
        {/* SVG Line Trail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {dimensions.width > 0 && (
                <path 
                    d={`M ${startLineX} ${startLineY} L ${tailX} ${tailY}`} 
                    stroke="#22c55e" 
                    strokeWidth="4" 
                    fill="none"
                    strokeLinecap="round"
                    className={`transition-opacity duration-1000 ${isResultState ? 'opacity-0' : 'opacity-80'}`}
                />
            )}
        </svg>

        {/* Multiplier Display */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black font-display z-10 transition-transform duration-300 ${crashed ? 'text-red-500 scale-125' : 'text-white'}`}>
          {multiplier.toFixed(2)}x
        </div>

        {/* Rocket Icon */}
        <div 
          className={`absolute bottom-10 left-10 text-5xl z-20 will-change-transform
            ${isPlaying ? 'transition-transform duration-75 ease-linear' : 'transition-all duration-700 ease-in-out'}
          `}
          style={{ 
              transformOrigin: 'center center',
              // Apply rotation ONLY when finished (isResultState)
              transform: isResultState
                 ? `translate(${currentX}px, ${-currentY}px) rotate(720deg) scale(0)`
                 : `translate(${currentX}px, ${-currentY}px)`,
              opacity: isResultState ? 0 : 1
          }}
        >
          <div className="relative">
              🚀
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-4 font-bold text-lg ${crashed ? 'text-red-400' : 'text-emerald-400'} animate-bounce-subtle`}>
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