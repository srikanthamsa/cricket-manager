'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Calendar, User, Plus, MapPin,
  Flame, TrendingUp, Settings, X, ListChecks,
  Shield, Zap, Star, Swords, Crown, Activity
} from 'lucide-react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

/* ─── Supabase ───────────────────────────────────────────────────────────── */
const CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
);

const supabase = CONFIGURED
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null;

/* ─── Constants ─────────────────────────────────────────────────────────── */
const FALLBACK_TEAMS = [
  { id: 'rcb', name: 'RCB', full: 'Royal Challengers Bengaluru', color: '#FF2A2A', owner: 'Srikant',  ground: 'M. Chinnaswamy Stadium, Bengaluru' },
  { id: 'csk', name: 'CSK', full: 'Chennai Super Kings',         color: '#FFEA00', owner: 'KVD',      ground: 'MA Chidambaram Stadium, Chennai' },
  { id: 'mi',  name: 'MI',  full: 'Mumbai Indians',              color: '#00C3FF', owner: 'Debu',     ground: 'Wankhede Stadium, Mumbai' },
  { id: 'kkr', name: 'KKR', full: 'Kolkata Knight Riders',       color: '#B94BFF', owner: 'Ekansh',   ground: 'Eden Gardens, Kolkata' },
  { id: 'srh', name: 'SRH', full: 'Sunrisers Hyderabad',         color: '#FF7B00', owner: 'Ashpak',   ground: 'Rajiv Gandhi Intl. Stadium, Hyderabad' },
];

const FIXTURE_LIST = [
  // ── Leg 1 ──
  { id: 'f1',  leg: 1, team1: 'RCB', team2: 'CSK' },
  { id: 'f2',  leg: 1, team1: 'MI',  team2: 'KKR' },
  { id: 'f3',  leg: 1, team1: 'SRH', team2: 'RCB' },
  { id: 'f4',  leg: 1, team1: 'CSK', team2: 'MI'  },
  { id: 'f5',  leg: 1, team1: 'KKR', team2: 'SRH' },
  { id: 'f6',  leg: 1, team1: 'RCB', team2: 'MI'  },
  { id: 'f7',  leg: 1, team1: 'KKR', team2: 'CSK' },
  { id: 'f8',  leg: 1, team1: 'SRH', team2: 'MI'  },
  { id: 'f9',  leg: 1, team1: 'RCB', team2: 'KKR' },
  { id: 'f10', leg: 1, team1: 'CSK', team2: 'SRH' },
  // ── Leg 2 ──
  { id: 'f11', leg: 2, team1: 'CSK', team2: 'RCB' },
  { id: 'f12', leg: 2, team1: 'KKR', team2: 'MI'  },
  { id: 'f13', leg: 2, team1: 'RCB', team2: 'SRH' },
  { id: 'f14', leg: 2, team1: 'MI',  team2: 'CSK' },
  { id: 'f15', leg: 2, team1: 'SRH', team2: 'KKR' },
  { id: 'f16', leg: 2, team1: 'MI',  team2: 'RCB' },
  { id: 'f17', leg: 2, team1: 'CSK', team2: 'KKR' },
  { id: 'f18', leg: 2, team1: 'MI',  team2: 'SRH' },
  { id: 'f19', leg: 2, team1: 'KKR', team2: 'RCB' },
  { id: 'f20', leg: 2, team1: 'SRH', team2: 'CSK' },
];

function getFixtureResult(
  fixture: { team1: string; team2: string; leg: number },
  allMatches: any[]
) {
  const relevant = allMatches
    .filter(m =>
      (m.team1 === fixture.team1 && m.team2 === fixture.team2) ||
      (m.team1 === fixture.team2 && m.team2 === fixture.team1)
    )
    .sort((a: any, b: any) => a.timestamp - b.timestamp);
  return relevant[fixture.leg - 1] || null;
}

const TeamIcon = ({ name, size = 16 }: { name: string, size?: number }) => {
  switch (name) {
    case 'RCB': return <Crown size={size} />;
    case 'CSK': return <Star size={size} />;
    case 'MI': return <Zap size={size} />;
    case 'KKR': return <Shield size={size} />;
    case 'SRH': return <Swords size={size} />;
    default: return <Shield size={size} />;
  }
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getMatchGradient(color1: string, color2: string) {
  return `linear-gradient(to right, ${color1}66 0%, transparent 35%, transparent 65%, ${color2}66 100%), rgba(255, 255, 255, 0.05)`;
}

function getTeamGradient(color: string) {
  return `linear-gradient(to right, ${color}66 0%, transparent 60%), rgba(255, 255, 255, 0.05)`;
}

/* ─── Header sub-component ───────────────────────────────────────────────── */
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="px-8 pt-14 pb-8 bg-black rounded-b-[3rem] mb-6 shadow-2xl">
    <h2 className="text-sm font-bold text-slate-400 tracking-wider mb-2 uppercase">{subtitle}</h2>
    <h1 className="text-4xl font-semibold text-white leading-none tracking-tight">{title}</h1>
  </div>
);

/* ─── Setup screen ───────────────────────────────────────────────────────── */
function SetupScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl mb-6">🏏</div>
      <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Setup Required</h1>
      <p className="text-sm text-slate-400 font-medium mb-8 max-w-xs leading-relaxed">
        Add your Supabase credentials to{' '}
        <code className="bg-white/10 px-2 py-1 rounded-full text-xs font-mono text-slate-200">.env.local</code>{' '}
        to enable real-time sync.
      </p>
      <div className="w-full max-w-sm text-left space-y-4 border-t border-white/10 pt-6">
        <p className="text-xs font-semibold tracking-wide text-slate-400 mb-3 uppercase">Setup Steps</p>
        {[
          'Create a Supabase project at supabase.com',
          'Run supabase/schema.sql in the SQL editor',
          'Copy .env.local.example → .env.local',
          'Fill in SUPABASE_URL and SUPABASE_ANON_KEY',
          'Restart the dev server',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-4 bg-white/5 p-4 rounded-full">
            <span className="text-indigo-400 font-bold text-sm mt-0.5 ml-2">
              0{i + 1}
            </span>
            <p className="text-sm text-slate-300 font-medium leading-snug">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function App() {
  if (!CONFIGURED) return <SetupScreen />;
  return <CricketApp />;
}

/* ─── App ────────────────────────────────────────────────────────────────── */
function CricketApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'fixtures' | 'standings' | 'profile'>('home');
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>(FALLBACK_TEAMS);
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [prefillTeams, setPrefillTeams] = useState<{ t1: string; t2: string } | null>(null);
  const [loading, setLoading] = useState(true);

  /* Initial fetch */
  useEffect(() => {
    async function load() {
      const [{ data: m }, { data: t }] = await Promise.all([
        supabase!.from('matches').select('*').order('timestamp', { ascending: false }),
        supabase!.from('teams').select('*'),
      ]);
      if (m) setMatches(m);
      if (t && t.length > 0) setTeams(t);
      setLoading(false);
    }
    load();
  }, []);

  /* Real-time subscription */
  useEffect(() => {
    const channel: RealtimeChannel = supabase!
      .channel('matches-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' },
        (payload) => setMatches(prev => [payload.new as any, ...prev])
      )
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
  }, []);

  /* Standings */
  const standings = useMemo(() => {
    const stats: Record<string, any> = {};
    teams.forEach(t => {
      stats[t.name] = { ...t, p: 0, w: 0, l: 0, pts: 0, form: [] };
    });
    matches.forEach(m => {
      const t1 = stats[m.team1];
      const t2 = stats[m.team2];
      if (!t1 || !t2) return;
      t1.p++; t2.p++;
      if (m.winner === m.team1) {
        t1.w++; t1.pts += 2; t1.form.push('W');
        t2.l++; t2.form.push('L');
      } else {
        t2.w++; t2.pts += 2; t2.form.push('W');
        t1.l++; t1.form.push('L');
      }
    });
    return Object.values(stats).sort((a: any, b: any) => b.pts - a.pts || b.w - a.w);
  }, [matches, teams]);

  const onFire = standings.find(
    (t: any) => t.form.length >= 3 && t.form.slice(-3).every((r: string) => r === 'W')
  );
  const bottler = standings.slice().reverse().find((t: any) => t.l >= 2);

  const nextFixture = useMemo(() =>
    FIXTURE_LIST.find(f => !getFixtureResult(f, matches)) || null,
  [matches]);

  const openScoreModal = (t1?: string, t2?: string) => {
    setPrefillTeams(t1 && t2 ? { t1, t2 } : null);
    setIsAddingScore(true);
  };

  const addMatch = async (data: any) => {
    const { data: inserted } = await supabase!
      .from('matches')
      .insert({ ...data, status: 'completed', timestamp: Date.now() })
      .select()
      .single();
    if (inserted) setMatches(prev => [inserted, ...prev]);
    setIsAddingScore(false);
    setPrefillTeams(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans pb-32 max-w-md mx-auto relative overflow-x-hidden text-slate-200 selection:bg-indigo-500/30">

      {/* ── Hero banner (home only) ── */}
      {activeTab === 'home' && (
        <div className="relative h-[24rem] w-full flex flex-col justify-end rounded-b-[3.5rem] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover opacity-60"
              alt="Cricket ground"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          <div className="relative z-10 px-8 pb-10">
            <p className="text-white/80 text-xs font-bold tracking-widest mb-2 uppercase">Mini IPL · 5-Over League</p>
            <h1 className="text-white text-5xl font-semibold tracking-tight leading-none mb-6">
              The Season
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest bg-black/40 w-max px-5 py-2.5 rounded-full backdrop-blur-md">
              <span className="text-indigo-400 flex items-center gap-1.5"><Activity size={14} /> {matches.length}/20 Played</span>
              <span className="text-slate-300">{20 - matches.length} Remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ HOME ══════════════════ */}
      {activeTab === 'home' && (
        <div className="pt-8">
          <div className="px-6 mb-12">
            <h3 className="text-2xl font-semibold tracking-tight mb-3 text-white">Next Match</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed px-1">
              The legendary 5-over derby continues. Who takes the points today?
            </p>
            {nextFixture ? (
              (() => {
                const c1 = FALLBACK_TEAMS.find(t => t.name === nextFixture.team1)?.color || '#fff';
                const c2 = FALLBACK_TEAMS.find(t => t.name === nextFixture.team2)?.color || '#fff';
                return (
                  <button
                    onClick={() => openScoreModal(nextFixture.team1, nextFixture.team2)}
                    style={{ background: getMatchGradient(c1, c2) }}
                    className="w-full py-6 rounded-[2.5rem] border border-white/5 text-white font-semibold flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4 w-full justify-center px-6">
                      <span className="text-lg font-bold tracking-wide uppercase">{nextFixture.team1}</span>
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">VS</span>
                      <span className="text-lg font-bold tracking-wide uppercase">{nextFixture.team2}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 px-5 py-2 rounded-full text-xs font-bold tracking-widest text-white/90 uppercase mt-2">
                      <Plus size={14} /> Record Result
                    </div>
                  </button>
                );
              })()
            ) : (
              <div className="w-full py-6 rounded-[2.5rem] bg-white/5 text-slate-400 font-bold tracking-wide text-center text-sm shadow-xl">
                All 20 matches played 🏆
              </div>
            )}
          </div>

          <div>
            <div className="px-6 mb-5">
              <h3 className="text-2xl font-semibold tracking-tight text-white">Recent Results</h3>
            </div>
            <div className="flex flex-col px-6 gap-4">
              {matches.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-medium text-sm bg-white/5 rounded-[3rem]">
                  No matches played yet
                </div>
              ) : (
                matches.slice(0, 10).map(m => {
                  const c1 = FALLBACK_TEAMS.find(t => t.name === m.team1)?.color || '#fff';
                  const c2 = FALLBACK_TEAMS.find(t => t.name === m.team2)?.color || '#fff';
                  return (
                    <div 
                      key={m.id} 
                      style={{ background: getMatchGradient(c1, c2) }}
                      className="px-6 py-5 rounded-[2.5rem] flex items-center justify-between hover:scale-[1.01] transition-transform shadow-lg border border-white/5"
                    >
                      <div className="flex items-center gap-5 flex-1">
                        <div className="flex flex-col items-center w-12">
                          <div className={`text-white transition-opacity ${m.winner === m.team1 ? 'opacity-100' : 'opacity-40'}`}>
                            <TeamIcon name={m.team1} size={22} />
                          </div>
                          <span className="text-sm font-bold mt-2 text-white">{m.score1}</span>
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-black/20 px-2 py-1 rounded-full">VS</span>
                        <div className="flex flex-col items-center w-12">
                          <div className={`text-white transition-opacity ${m.winner === m.team2 ? 'opacity-100' : 'opacity-40'}`}>
                            <TeamIcon name={m.team2} size={22} />
                          </div>
                          <span className="text-sm font-bold mt-2 text-white">{m.score2}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-[11px] font-bold tracking-widest text-white bg-black/40 px-3 py-1.5 rounded-full uppercase">{m.winner} Won</p>
                        <p className="text-[10px] font-semibold text-white/50 tracking-wide mr-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ FIXTURES ══════════════════ */}
      {activeTab === 'fixtures' && (
        <div className="pb-12">
          <Header subtitle="Tournament Schedule" title="Fixtures" />

          <div className="mt-8 px-6">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Leg 1 — First Round</p>
            <div className="flex flex-col gap-4 mb-12">
              {FIXTURE_LIST.filter(f => f.leg === 1).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
                const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
                return (
                  <div
                    key={fixture.id}
                    onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                    style={{ background: getMatchGradient(t1.color, t2.color) }}
                    className={`relative overflow-hidden px-6 py-5 rounded-[2.5rem] flex items-center justify-between border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] ${!result ? 'cursor-pointer hover:scale-[1.02] hover:border-white/40 transition-all' : ''}`}
                  >
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-white"><TeamIcon name={t1.name} size={20} /></div>
                        <span className="font-bold text-base text-white">{t1.name}</span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-white/60 uppercase ml-8 bg-black/20 px-2 py-0.5 rounded-full">Home</span>
                    </div>
                    <div className="text-center px-4 flex-shrink-0">
                      {result ? (
                        <div className="text-center bg-black/60 px-4 py-2 rounded-full shadow-inner">
                          <p className="text-lg font-bold text-white leading-none">{result.score1}–{result.score2}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">vs</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-1">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="text-white"><TeamIcon name={t2.name} size={20} /></div>
                        <span className="font-bold text-base text-white">{t2.name}</span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mr-8 bg-black/20 px-2 py-0.5 rounded-full">Away</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Leg 2 — Return Fixtures</p>
            <div className="flex flex-col gap-4 mb-12">
              {FIXTURE_LIST.filter(f => f.leg === 2).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
                const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
                return (
                  <div
                    key={fixture.id}
                    onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                    style={{ background: getMatchGradient(t1.color, t2.color) }}
                    className={`relative overflow-hidden px-6 py-5 rounded-[2.5rem] flex items-center justify-between border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] ${!result ? 'cursor-pointer hover:scale-[1.02] hover:border-white/40 transition-all' : ''}`}
                  >
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-white"><TeamIcon name={t1.name} size={20} /></div>
                        <span className="font-bold text-base text-white">{t1.name}</span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-white/60 uppercase ml-8 bg-black/20 px-2 py-0.5 rounded-full">Home</span>
                    </div>
                    <div className="text-center px-4 flex-shrink-0">
                      {result ? (
                        <div className="text-center bg-black/60 px-4 py-2 rounded-full shadow-inner">
                          <p className="text-lg font-bold text-white leading-none">{result.score1}–{result.score2}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">vs</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-1">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="text-white"><TeamIcon name={t2.name} size={20} /></div>
                        <span className="font-bold text-base text-white">{t2.name}</span>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mr-8 bg-black/20 px-2 py-0.5 rounded-full">Away</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Playoffs</p>
            <div className="flex flex-col gap-4">
              <div 
                className="relative overflow-hidden px-6 py-6 rounded-[2.5rem] border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)]"
                style={{ background: getMatchGradient(standings[1]?.color || '#555', standings[2]?.color || '#555') }}
              >
                <p className="text-xs font-bold text-white/80 mb-5 uppercase tracking-widest bg-black/40 w-max px-4 py-1.5 rounded-full">Qualifier <span className="text-white/50 ml-1 normal-case font-semibold">(2nd vs 3rd)</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-white"><TeamIcon name={standings[1]?.name ?? ''} size={22} /></div>
                      <span className="font-bold text-xl text-white">{standings[1]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mt-1 ml-9 bg-black/20 px-2 py-0.5 rounded-full">Home</span>
                  </div>
                  <span className="text-white/50 font-black text-[10px] uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">VS</span>
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <div className="text-white"><TeamIcon name={standings[2]?.name ?? ''} size={22} /></div>
                      <span className="font-bold text-xl text-white">{standings[2]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mt-1 mr-9 bg-black/20 px-2 py-0.5 rounded-full">Away</span>
                  </div>
                </div>
              </div>
              <div 
                className="relative overflow-hidden px-6 py-6 rounded-[2.5rem] border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)]"
                style={{ background: getMatchGradient(standings[0]?.color || '#4f46e5', '#888') }}
              >
                <p className="text-xs font-bold text-white mb-5 uppercase tracking-widest bg-black/50 w-max px-4 py-1.5 rounded-full shadow-inner">Grand Final <span className="text-white/60 ml-1 normal-case font-semibold">(1st vs Q Winner)</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-white"><TeamIcon name={standings[0]?.name ?? ''} size={22} /></div>
                      <span className="font-bold text-xl text-white">{standings[0]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mt-1 ml-9 bg-black/20 px-2 py-0.5 rounded-full">Home</span>
                  </div>
                  <span className="text-white/50 font-black text-[10px] uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">VS</span>
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <div className="text-white"><Trophy size={22} /></div>
                      <span className="font-bold text-xl text-white">Winner</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-white/60 uppercase mt-1 mr-9 bg-black/20 px-2 py-0.5 rounded-full">Away</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ STANDINGS ══════════════════ */}
      {activeTab === 'standings' && (
        <div className="pb-12">
          <Header subtitle="Leaderboard" title="Standings" />
          
          <div className="mt-6 mb-12 px-6">
            <div className="bg-white/5 rounded-[3rem] p-3 shadow-xl">
              <div className="grid grid-cols-6 px-4 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <div className="col-span-3">Team</div>
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-right">PTS</div>
              </div>
              <div className="flex flex-col gap-2">
                {standings.map((team: any, idx) => (
                  <div 
                    key={team.name} 
                    style={{ background: getTeamGradient(team.color || '#555') }}
                    className="grid grid-cols-6 px-5 py-5 items-center bg-black/40 rounded-[2.5rem] hover:scale-[1.01] transition-transform shadow-md"
                  >
                    <div className="col-span-3 flex items-center gap-4">
                      <span className="text-xs font-bold text-white/60 w-3">{idx + 1}</span>
                      <div className="text-white drop-shadow-md">
                        <TeamIcon name={team.name} size={22} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-bold tracking-tight text-white truncate">{team.full || team.name}</span>
                        <div className="flex gap-1.5 mt-2">
                          {team.form.slice(-5).map((res: string, i: number) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${res === 'W' ? 'bg-indigo-400' : 'bg-white/20'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm font-bold text-white/80">{team.p}</div>
                    <div className="text-center text-sm font-bold text-white/80">{team.w}</div>
                    <div className="text-right font-black text-xl text-white drop-shadow-md">{team.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Performance Highlights</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-6 py-6 bg-gradient-to-r from-orange-500/20 to-transparent rounded-[2.5rem] border border-white/5 shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="bg-orange-500 p-3 rounded-full shadow-lg shadow-orange-500/20">
                    <Flame size={24} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-400/80 uppercase tracking-widest mb-1">On Fire</p>
                    <p className="font-bold text-lg text-white">{onFire ? onFire.name : standings[0]?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="bg-black/60 px-5 py-2.5 rounded-full shadow-inner">
                  <span className="text-xl font-bold text-white">{standings[0]?.pts ?? 0} pts</span>
                </div>
              </div>
              <div className="flex justify-between items-center px-6 py-6 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-[2.5rem] border border-white/5 shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="bg-indigo-500 p-3 rounded-full shadow-lg shadow-indigo-500/20">
                    <TrendingUp size={24} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest mb-1">Bottlers</p>
                    <p className="font-bold text-lg text-white">{bottler ? bottler.name : standings[standings.length - 1]?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="bg-black/60 px-5 py-2.5 rounded-full shadow-inner">
                  <span className="text-xl font-bold text-white">{bottler?.l ?? 0} L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ PROFILE ══════════════════ */}
      {activeTab === 'profile' && (
        <div className="pb-12">
          <Header subtitle="RCB Owner · Your Stats" title="Captain Srikant" />
          
          <div className="grid grid-cols-2 gap-4 px-6 mb-8">
            <div className="p-8 text-center bg-gradient-to-b from-white/10 to-white/5 rounded-[3rem] shadow-lg border border-white/5">
              <p className="text-[10px] font-black text-slate-400 tracking-widest mb-3 uppercase">Played</p>
              <p className="text-6xl font-bold text-indigo-400 drop-shadow-lg">{matches.length}</p>
            </div>
            <div className="p-8 text-center bg-gradient-to-b from-white/10 to-white/5 rounded-[3rem] shadow-lg border border-white/5">
              <p className="text-[10px] font-black text-slate-400 tracking-widest mb-3 uppercase">Remaining</p>
              <p className="text-6xl font-bold text-white drop-shadow-lg">{Math.max(0, 20 - matches.length)}</p>
            </div>
          </div>

          <div className="px-6 mb-8">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Teams &amp; Owners</h4>
            <div className="flex flex-col gap-4">
              {standings.map((t: any) => (
                <div 
                  key={t.name} 
                  style={{ background: getTeamGradient(t.color || '#555') }}
                  className="px-6 py-6 bg-black/40 rounded-[3rem] hover:scale-[1.01] transition-transform shadow-lg border border-white/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                      <div className="text-white drop-shadow-md"><TeamIcon name={t.name} size={24} /></div>
                      <div>
                        <p className="text-base font-bold text-white">{t.full || t.name}</p>
                        <p className="text-xs font-semibold text-white/60 mt-1">Owner: <span className="text-white font-bold">{t.owner || '—'}</span></p>
                      </div>
                    </div>
                    <div className="text-right bg-black/60 px-5 py-2.5 rounded-full shadow-inner">
                      <p className="text-lg font-bold text-white">{t.pts} pts</p>
                      <p className="text-[10px] text-white/50 font-black tracking-widest uppercase mt-1">{t.w}W {t.l}L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-5 bg-black/30 p-3 rounded-full w-max shadow-inner">
                    <MapPin size={14} className="text-white/60 flex-shrink-0 ml-1" />
                    <p className="text-xs text-white/70 font-semibold pr-2">{t.ground || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6">
            <h4 className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 ml-2 uppercase">Achievement</h4>
            <div className="flex items-center gap-5 px-6 py-6 bg-gradient-to-r from-red-600/30 to-red-600/5 rounded-[3rem] border border-red-500/20 shadow-lg">
              <div className="bg-red-600 p-3 rounded-full shadow-lg shadow-red-600/40">
                <Trophy size={28} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">RCB Owner</p>
                <p className="text-xs font-semibold text-red-200/80 mt-1">We will win it this year 🔴</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddingScore && (
        <ScoreModal
          teams={teams}
          defaultTeam1={prefillTeams?.t1}
          defaultTeam2={prefillTeams?.t2}
          onClose={() => { setIsAddingScore(false); setPrefillTeams(null); }}
          onSubmit={addMatch}
        />
      )}

      {/* FAB */}
      <button
        onClick={() => nextFixture ? openScoreModal(nextFixture.team1, nextFixture.team2) : openScoreModal()}
        className="fixed bottom-28 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center z-40 hover:scale-110 active:scale-90 transition-all shadow-xl shadow-indigo-600/30 border-2 border-indigo-400/50"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-[4.5rem] bg-black/80 backdrop-blur-xl flex items-center justify-around px-2 z-40 rounded-full border border-white/10 shadow-2xl">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
          <Calendar size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        </button>
        <button onClick={() => setActiveTab('fixtures')} className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${activeTab === 'fixtures' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
          <ListChecks size={22} strokeWidth={activeTab === 'fixtures' ? 2.5 : 2} />
        </button>
        <button onClick={() => setActiveTab('standings')} className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${activeTab === 'standings' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
          <Trophy size={22} strokeWidth={activeTab === 'standings' ? 2.5 : 2} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-full flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white'}`}>
          <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
}

/* ─── Score Modal ────────────────────────────────────────────────────────── */
function ScoreModal({
  teams, onClose, onSubmit, defaultTeam1, defaultTeam2,
}: {
  teams: any[];
  onClose: () => void;
  onSubmit: (d: any) => Promise<void>;
  defaultTeam1?: string;
  defaultTeam2?: string;
}) {
  const [team1, setTeam1] = useState(defaultTeam1 || '');
  const [team2, setTeam2] = useState(defaultTeam2 || '');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1 || !team2 || !score1 || !score2 || team1 === team2) return;
    setSubmitting(true);
    const s1 = parseInt(score1), s2 = parseInt(score2);
    await onSubmit({ team1, team2, score1: s1, score2: s2, winner: s1 >= s2 ? team1 : team2 });
  };

  const sel = "w-full bg-black/40 py-5 px-6 rounded-full text-white text-base font-bold outline-none focus:bg-black/60 focus:ring-2 ring-indigo-500/50 transition-all appearance-none border border-white/5";
  const inp = "w-full bg-black/40 py-5 px-6 rounded-full text-white text-base font-bold outline-none focus:bg-black/60 focus:ring-2 ring-indigo-500/50 transition-all border border-white/5";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-950 rounded-t-[3.5rem] border-t border-white/10 p-8 overflow-y-auto max-h-[95vh] shadow-2xl">
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Score Card</h2>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"><X size={24} strokeWidth={2} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-lg space-y-5">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Team 1 (Batting First)</p>
              <select value={team1} onChange={e => setTeam1(e.target.value)} className={sel} required>
                <option value="" className="bg-slate-900 text-slate-400">Select team…</option>
                {teams.filter(t => t.name !== team2).map(t => <option key={t.id} value={t.name} className="bg-slate-900 text-white">{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 54)" value={score1} onChange={e => setScore1(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
            <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-lg space-y-5">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Team 2 (Chasing)</p>
              <select value={team2} onChange={e => setTeam2(e.target.value)} className={sel} required>
                <option value="" className="bg-slate-900 text-slate-400">Select team…</option>
                {teams.filter(t => t.name !== team1).map(t => <option key={t.id} value={t.name} className="bg-slate-900 text-white">{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 55)" value={score2} onChange={e => setScore2(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
          </div>
          <div className="pt-2 pb-6">
            <div className="flex items-center gap-4 bg-indigo-500/10 p-5 rounded-[2rem] mb-6 border border-indigo-500/20">
              <div className="bg-indigo-500 p-2 rounded-full text-white"><Activity size={16} strokeWidth={3} /></div>
              <p className="text-xs text-indigo-200/80 font-medium leading-relaxed"><span className="text-indigo-400 font-bold mr-1">Live Sync.</span>Standings update instantly for all players.</p>
            </div>
            <button
              type="submit"
              disabled={submitting || !team1 || !team2 || !score1 || !score2 || team1 === team2}
              className="w-full py-6 bg-indigo-600 rounded-full text-white text-lg font-bold hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-xl shadow-indigo-600/20"
            >
              {submitting ? 'Publishing…' : 'Publish Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
