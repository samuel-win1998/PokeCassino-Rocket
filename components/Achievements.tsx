import React, { useMemo, useState } from 'react';
import { Achievement, PlayerState } from '../types';
import { ACHIEVEMENTS, TYPE_COLORS } from '../constants';

interface AchievementsProps {
    player: PlayerState;
}

export const Achievements: React.FC<AchievementsProps> = ({ player }) => {
    const [filter, setFilter] = useState<'ALL' | 'wealth' | 'collection' | 'game' | 'type'>('ALL');

    const sortedAchievements = useMemo(() => {
        let list = ACHIEVEMENTS;
        if (filter !== 'ALL') {
            list = list.filter(a => a.category === filter);
        }

        // Sort: Unlocked first, then by completion %
        return list.sort((a, b) => {
            const isCompletedA = player.completedAchievementIds.includes(a.id);
            const isCompletedB = player.completedAchievementIds.includes(b.id);
            if (isCompletedA && !isCompletedB) return -1;
            if (!isCompletedA && isCompletedB) return 1;

            const progressA = a.progress(player);
            const percentA = Math.min(100, (progressA.current / progressA.max) * 100);
            
            const progressB = b.progress(player);
            const percentB = Math.min(100, (progressB.current / progressB.max) * 100);

            return percentB - percentA;
        });
    }, [player, filter]);

    const completedCount = player.completedAchievementIds.length;
    const totalCount = ACHIEVEMENTS.length;

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">Achievements</h2>
                    <p className="text-slate-400">Complete tasks to earn huge credit rewards!</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-yellow-400">
                        {completedCount} / {totalCount}
                    </div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completed</div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['ALL', 'wealth', 'game', 'collection', 'type'] as const).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors whitespace-nowrap ${
                            filter === cat 
                                ? 'bg-violet-600 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedAchievements.map(ach => {
                    const isCompleted = player.completedAchievementIds.includes(ach.id);
                    const progress = ach.progress(player);
                    const percent = Math.min(100, (progress.current / progress.max) * 100);

                    // For type achievements, we want to color code the border if possible
                    let borderColor = 'border-white/5';
                    if (ach.category === 'type') {
                         const typeName = ach.id.split('_')[1];
                         // @ts-ignore
                         if (TYPE_COLORS[typeName]) {
                             // Extract color class and try to map it to a border color, 
                             // for simplicity just using a generic colored border for type tasks
                             if (isCompleted) borderColor = 'border-emerald-500/50';
                         }
                    } else if (isCompleted) {
                        borderColor = 'border-yellow-500/50';
                    }

                    return (
                        <div 
                            key={ach.id} 
                            className={`glass-panel p-4 rounded-xl border relative overflow-hidden transition-all ${borderColor} ${isCompleted ? 'bg-slate-800/80' : 'bg-slate-900/40'}`}
                        >
                            {isCompleted && (
                                <div className="absolute top-0 right-0 p-2 text-yellow-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-2 pr-8">
                                <h3 className={`font-bold ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
                                    {ach.title}
                                </h3>
                                <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-emerald-400">
                                    +${ach.reward.toLocaleString()}
                                </span>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-4">{ach.description}</p>

                            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-violet-600'}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs font-mono text-slate-500">
                                <span>{isCompleted ? 'Completed' : 'In Progress'}</span>
                                <span>
                                    {ach.category === 'wealth' 
                                        ? `$${progress.current.toLocaleString(undefined, { notation: "compact" })} / $${progress.max.toLocaleString(undefined, { notation: "compact" })}` 
                                        : `${progress.current} / ${progress.max}`
                                    }
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};