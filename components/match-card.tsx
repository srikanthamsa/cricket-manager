'use client';

import { motion } from 'framer-motion';
import { Match, Team } from '@/lib/types';
import { CheckCircle2, Clock } from 'lucide-react';

interface Props {
  match: Match;
  teams: Record<string, Team>;
  onClick: () => void;
  index?: number;
}

/* Deterministic gradient per match so each card feels unique */
const gradients = [
  'linear-gradient(160deg, #2d4a1e 0%, #4a7a2f 100%)',
  'linear-gradient(160deg, #1a3a28 0%, #3a6b44 100%)',
  'linear-gradient(160deg, #2a3d18 0%, #5a7232 100%)',
  'linear-gradient(160deg, #1e3a2a 0%, #2d5e3a 100%)',
  'linear-gradient(160deg, #243318 0%, #4a6228 100%)',
];

export default function MatchCard({ match, teams, onClick, index = 0 }: Props) {
  const t1 = teams[match.team1Id];
  const t2 = teams[match.team2Id];
  const completed = match.status === 'completed';
  const winner = match.winnerId;
  const gradient = gradients[index % gradients.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="w-full text-left rounded-[20px] overflow-hidden shadow-sm"
      style={{ background: '#fff' }}
    >
      {/* Photo hero area */}
      <div className="relative h-28 flex items-end p-4" style={{ background: gradient }}>
        {/* Cricket field circle decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-24 h-24 rounded-full border-2 border-white" />
          <div className="absolute w-1 h-full bg-white/30" />
        </div>

        <div className="relative z-10 w-full flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              Match {match.matchNumber} · Round {match.round}
            </span>
            <p className="font-display text-xl text-white uppercase mt-0.5">
              {t1?.shortName} vs {t2?.shortName}
            </p>
          </div>
          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm ${
            completed ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
          }`}>
            {completed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
            {completed ? 'Done' : 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Team 1 */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{t1?.emoji}</span>
            <div>
              <p className="text-sm font-bold text-[#1a1a1a] leading-tight"
                style={{ color: winner === t1?.id ? t1?.color : winner ? '#bbb' : '#1a1a1a' }}>
                {t1?.name}
              </p>
              {completed && (
                <p className="text-xs text-[#888]">{match.team1Runs}/{match.team1Wickets}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center px-1">
            <span className="text-xs font-black text-[#ccc] tracking-widest">VS</span>
            {completed && (
              <span className="text-[9px] font-semibold mt-0.5"
                style={{ color: '#4a5e2a' }}>
                {Math.abs((match.team1Runs ?? 0) - (match.team2Runs ?? 0))} runs
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-2 flex-1 flex-row-reverse text-right">
            <span className="text-xl">{t2?.emoji}</span>
            <div>
              <p className="text-sm font-bold leading-tight"
                style={{ color: winner === t2?.id ? t2?.color : winner ? '#bbb' : '#1a1a1a' }}>
                {t2?.name}
              </p>
              {completed && (
                <p className="text-xs text-[#888]">{match.team2Runs}/{match.team2Wickets}</p>
              )}
            </div>
          </div>
        </div>

        {!completed && (
          <div className="mt-3 flex items-center justify-center">
            <span className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{ background: '#4a5e2a' }}>
              Tap to Enter Score
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
