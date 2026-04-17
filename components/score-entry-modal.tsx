'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, Team } from '@/lib/types';
import { submitScore } from '@/lib/store';
import { X, CheckCircle2 } from 'lucide-react';

interface Props {
  match: Match | null;
  teams: Record<string, Team>;
  onClose: () => void;
  onSaved: () => void;
}

function ScoreInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#888]">{label}</label>
      <input
        type="number"
        min={0}
        max={999}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-2xl px-4 py-3.5 text-xl font-bold text-center focus:outline-none transition-all duration-200 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{
          background: '#f0ebe0',
          border: '1.5px solid transparent',
        }}
        onFocus={e => e.currentTarget.style.borderColor = '#4a5e2a'}
        onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
        placeholder="0"
        inputMode="numeric"
      />
    </div>
  );
}

export default function ScoreEntryModal({ match, teams, onClose, onSaved }: Props) {
  const [t1Runs, setT1Runs] = useState('');
  const [t1Wkts, setT1Wkts] = useState('');
  const [t2Runs, setT2Runs] = useState('');
  const [t2Wkts, setT2Wkts] = useState('');
  const [saved, setSaved] = useState(false);

  if (!match) return null;
  const t1 = teams[match.team1Id];
  const t2 = teams[match.team2Id];
  const canSubmit = t1Runs !== '' && t1Wkts !== '' && t2Runs !== '' && t2Wkts !== '' && t1Runs !== t2Runs;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitScore(match.id, +t1Runs, +t1Wkts, +t2Runs, +t2Wkts);
    setSaved(true);
    setTimeout(() => { onSaved(); onClose(); }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-t-[28px] overflow-hidden"
          style={{ background: '#f0ebe0' }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-black/15" />
          </div>

          {/* Hero strip */}
          <div className="relative h-20 flex items-center px-5 hero-cricket">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-white" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Match {match.matchNumber}</p>
              <p className="font-display text-2xl text-white uppercase">Enter Score</p>
            </div>
            <button onClick={onClose}
              className="relative z-10 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <X size={15} className="text-white" />
            </button>
          </div>

          <div className="px-4 py-5 space-y-4">
            {/* Team 1 */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{t1.emoji}</span>
                <span className="font-bold text-sm" style={{ color: t1.color }}>{t1.name}</span>
                <span className="text-xs text-[#bbb] ml-auto font-medium">Batting first</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ScoreInput label="Runs" value={t1Runs} onChange={setT1Runs} />
                <ScoreInput label="Wickets" value={t1Wkts} onChange={setT1Wkts} />
              </div>
            </div>

            {/* Team 2 */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{t2.emoji}</span>
                <span className="font-bold text-sm" style={{ color: t2.color }}>{t2.name}</span>
                <span className="text-xs text-[#bbb] ml-auto font-medium">Chasing</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ScoreInput label="Runs" value={t2Runs} onChange={setT2Runs} />
                <ScoreInput label="Wickets" value={t2Wkts} onChange={setT2Wkts} />
              </div>
            </div>

            {t1Runs !== '' && t2Runs !== '' && t1Runs === t2Runs && (
              <p className="text-xs text-center font-semibold" style={{ color: '#c47a00' }}>
                Scores tied — adjust to determine winner
              </p>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit || saved}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: saved ? '#22c55e' : canSubmit ? '#4a5e2a' : '#ddd',
                color: saved || canSubmit ? '#fff' : '#aaa',
              }}
            >
              {saved ? <><CheckCircle2 size={16} /> Saved!</> : 'Save Result'}
            </motion.button>

            <div className="h-2" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
