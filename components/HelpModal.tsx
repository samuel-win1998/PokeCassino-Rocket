import React from 'react';
import { Button } from './ui/Button';
import { CLASS_FIXED_MULTIPLIERS } from '../constants';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Game Guide
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
          </div>

          <div className="space-y-6 text-slate-300">
            
            <section>
              <h3 className="text-xl font-bold text-white mb-2">🎰 How to Play</h3>
              <p className="text-sm leading-relaxed">
                Welcome to PokeCasino! Build your team of Pokémon to boost your winnings in casino games.
                <br/>
                1. <strong>Buy Pokémon</strong> from the Market.
                <br/>
                2. <strong>Equip them</strong> in your Storage (Max 6).
                <br/>
                3. <strong>Play Games</strong> (Roulette, Rocket, Slots). Your equipped team provides a passive multiplier bonus to your winnings!
              </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-2">💰 Selling Pokémon</h3>
                <p className="text-sm leading-relaxed mb-2">
                    Need quick cash or want to clear space?
                </p>
                <div className="bg-slate-800 p-3 rounded-xl border border-emerald-500/30 font-mono text-xs">
                    You can sell any Pokémon (except your starter) back to the market for <span className="text-emerald-400">75% of its purchase price</span>.
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-2">✨ Shiny Pokémon</h3>
                <p className="text-sm leading-relaxed mb-2">
                    Rare variants of Pokémon that have a <strong>2% chance</strong> to appear in the market.
                </p>
                <div className="bg-slate-800 p-3 rounded-xl border border-yellow-500/30 font-mono text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Cost: <span className="text-yellow-400">2x Normal Price</span></li>
                        <li>Bonus: <span className="text-emerald-400">1.2x Multiplier Stats</span></li>
                        <li>Visual: Gold border and sparkles.</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-2">🧬 Fusion & Forms</h3>
                <p className="text-sm leading-relaxed mb-2">
                    Certain Legendary Pokémon can change form or fuse with others in your squad panel.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                        <span className="block font-bold text-white">DNA Splicers (Fusion)</span>
                        <ul className="list-disc pl-4 text-slate-400">
                            <li>Necrozma + Solgaleo/Lunala</li>
                            <li>Kyurem + Zekrom/Reshiram</li>
                            <li>Calyrex + Glastrier/Spectrier</li>
                        </ul>
                        <span className="text-xs italic text-slate-500 mt-1 block">Requires Base in Squad & Partner in Inventory.</span>
                    </div>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                        <span className="block font-bold text-white">Zygarde Cube / Orbs</span>
                        <p className="text-slate-400">Cycle Forms / Primal:</p>
                        <p className="font-mono text-emerald-400">Zygarde, Kyogre, Groudon...</p>
                    </div>
                </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-white mb-2">📊 Percentage Calculation</h3>
              <p className="text-sm leading-relaxed mb-2">
                A Pokémon's power is determined by its <strong>Total Base Stats</strong> and its <strong>Class</strong>.
              </p>
              <div className="bg-slate-800 p-3 rounded-xl border border-white/5 font-mono text-xs">
                Formula: (Total Stats / 100) × Class Multiplier = Bonus %
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Example: A Charizard (534 Stats) with Class A (x25).
                <br/>
                (534 / 100) = 5.34% Base.
                <br/>
                5.34% × 25 = <strong>+133.5% Bonus</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-white mb-2">🌟 Classes & Rarity</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {Object.entries(CLASS_FIXED_MULTIPLIERS).map(([cls, mult]) => (
                  <div key={cls} className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="block font-bold text-white mb-1">Class {cls}</span>
                    <span className="text-emerald-400">x{mult}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-white mb-2">🛒 Market Rules & Costs</h3>
              <p className="text-sm mb-4">Filtering the market helps you find what you need, but adds to the refresh cost.</p>
              
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 text-xs">
                  <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-400">
                          <tr>
                              <th className="p-3">Filter Type</th>
                              <th className="p-3">Cost Added</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 text-slate-300">
                          <tr>
                              <td className="p-3">Base Refresh</td>
                              <td className="p-3 font-mono">1,000</td>
                          </tr>
                          <tr>
                              <td className="p-3">Specific Generation</td>
                              <td className="p-3 font-mono">+5,000</td>
                          </tr>
                          <tr>
                              <td className="p-3">Specific Type</td>
                              <td className="p-3 font-mono">+5,000</td>
                          </tr>
                          <tr>
                              <td className="p-3">Specific Bonus</td>
                              <td className="p-3 font-mono">+5,000</td>
                          </tr>
                          <tr>
                              <td className="p-3">Class Filter</td>
                              <td className="p-3 font-mono">
                                  <div className="flex flex-col gap-1">
                                      <span>Class F: -500</span>
                                      <span>Class D: +1,000</span>
                                      <span>Class C: +5,000</span>
                                      <span>Class B: +10,000</span>
                                      <span>Class A: +25,000</span>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td className="p-3">Group Filter</td>
                              <td className="p-3 font-mono">
                                  <div className="flex flex-col gap-1">
                                      <span>Starter: +1,000</span>
                                      <span>Pseudo-Legendary: +5,000</span>
                                      <span>Paradox: +10,000</span>
                                      <span>Ultra Beast: +15,000</span>
                                      <span>Mythical: +20,000</span>
                                      <span>Legendary: +25,000</span>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
            </section>

          </div>

          <div className="mt-8">
            <Button fullWidth onClick={onClose}>Got it!</Button>
          </div>
        </div>
      </div>
    </div>
  );
};