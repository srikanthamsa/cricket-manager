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
  { id: 'rcb', name: 'RCB', full: 'Royal Challengers Bengaluru', color: '#EC1C24', owner: 'Srikant',  ground: 'M. Chinnaswamy Stadium, Bengaluru' },
  { id: 'csk', name: 'CSK', full: 'Chennai Super Kings',         color: '#FFCB05', owner: 'KVD',      ground: 'MA Chidambaram Stadium, Chennai' },
  { id: 'mi',  name: 'MI',  full: 'Mumbai Indians',              color: '#004BA0', owner: 'Debu',     ground: 'Wankhede Stadium, Mumbai' },
  { id: 'kkr', name: 'KKR', full: 'Kolkata Knight Riders',       color: '#3A225D', owner: 'Ekansh',   ground: 'Eden Gardens, Kolkata' },
  { id: 'srh', name: 'SRH', full: 'Sunrisers Hyderabad',         color: '#FF6B35', owner: 'Ashpak',   ground: 'Rajiv Gandhi Intl. Stadium, Hyderabad' },
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

/* ─── Header sub-component ───────────────────────────────────────────────── */
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="px-6 pt-12 pb-6 bg-black rounded-b-3xl mb-4">
    <h2 className="text-sm font-semibold text-slate-400 tracking-wide mb-1">{subtitle}</h2>
    <h1 className="text-3xl font-semibold text-white leading-none tracking-tight">{title}</h1>
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
        <code className="bg-white/10 px-1.5 py-0.5 rounded-lg text-xs font-mono text-slate-200">.env.local</code>{' '}
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
          <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-2xl">
            <span className="text-indigo-400 font-medium text-sm mt-0.5">
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
    <div className="min-h-screen bg-black font-sans pb-28 max-w-md mx-auto relative overflow-x-hidden text-slate-200 selection:bg-indigo-500/30">

      {/* ── Hero banner (home only) ── */}
      {activeTab === 'home' && (
        <div className="relative h-[22rem] w-full flex flex-col justify-end rounded-b-[2rem] overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover opacity-60"
              alt="Cricket ground"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
          <div className="relative z-10 px-6 pb-8">
            <p className="text-slate-300 text-xs font-semibold tracking-widest mb-2 uppercase">Mini IPL · 5-Over League</p>
            <h1 className="text-white text-5xl font-semibold tracking-tight leading-none mb-6">
              The Season
            </h1>
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide">
              <span className="text-indigo-400 flex items-center gap-1.5"><Activity size={14} /> {matches.length}/20 Played</span>
              <span className="text-slate-400">{20 - matches.length} Remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ HOME ══════════════════ */}
      {activeTab === 'home' && (
        <div className="pt-8">
          <div className="px-6 mb-12">
            <h3 className="text-xl font-semibold tracking-tight mb-2 text-white">Next Match</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              The legendary 5-over derby continues. Who takes the points today?
            </p>
            {nextFixture ? (
              <button
                onClick={() => openScoreModal(nextFixture.team1, nextFixture.team2)}
                className="w-full py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-medium flex items-center justify-between px-6 hover:bg-white/10 active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400"><Plus size={18} /></span>
                  <span className="text-sm">Record Result</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">{nextFixture.team1} vs {nextFixture.team2}</span>
                </div>
              </button>
            ) : (
              <div className="w-full py-5 rounded-2xl bg-white/5 text-slate-400 font-medium text-center text-sm">
                All 20 matches played 🏆
              </div>
            )}
          </div>

          <div>
            <div className="px-6 mb-4">
              <h3 className="text-xl font-semibold tracking-tight text-white">Recent Results</h3>
            </div>
            <div className="flex flex-col px-6 gap-3">
              {matches.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-medium text-sm bg-white/5 rounded-3xl">
                  No matches played yet
                </div>
              ) : (
                matches.slice(0, 10).map(m => (
                  <div key={m.id} className="px-5 py-4 bg-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`text-white transition-opacity ${m.winner === m.team1 ? 'opacity-100 text-indigo-400' : 'opacity-40'}`}>
                          <TeamIcon name={m.team1} size={20} />
                        </div>
                        <span className="text-sm font-semibold mt-2 text-slate-300">{m.score1}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">VS</span>
                      <div className="flex flex-col items-center">
                        <div className={`text-white transition-opacity ${m.winner === m.team2 ? 'opacity-100 text-indigo-400' : 'opacity-40'}`}>
                          <TeamIcon name={m.team2} size={20} />
                        </div>
                        <span className="text-sm font-semibold mt-2 text-slate-300">{m.score2}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold tracking-wide text-white mb-1">{m.winner} Won</p>
                      <p className="text-[10px] font-medium text-slate-500">{new Date(m.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
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
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Leg 1 — First Round</p>
            <div className="flex flex-col gap-3 mb-10">
              {FIXTURE_LIST.filter(f => f.leg === 1).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
                const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
                return (
                  <div
                    key={fixture.id}
                    onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                    className={`px-5 py-4 bg-white/5 rounded-2xl flex items-center justify-between ${!result ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}`}
                  >
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={result?.winner === t1.name ? 'text-indigo-400' : 'text-slate-400'}><TeamIcon name={t1.name} size={18} /></div>
                        <span className={`font-semibold text-sm ${result?.winner === t1.name ? 'text-white' : 'text-slate-300'}`}>{t1.name}</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Home</span>
                    </div>
                    <div className="text-center px-4 flex-shrink-0">
                      {result ? (
                        <div className="text-center bg-black/40 px-3 py-1.5 rounded-xl">
                          <p className="text-lg font-semibold text-white leading-none">{result.score1}–{result.score2}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">vs</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-1">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className={result?.winner === t2.name ? 'text-indigo-400' : 'text-slate-400'}><TeamIcon name={t2.name} size={18} /></div>
                        <span className={`font-semibold text-sm ${result?.winner === t2.name ? 'text-white' : 'text-slate-300'}`}>{t2.name}</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Away</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Leg 2 — Return Fixtures</p>
            <div className="flex flex-col gap-3 mb-10">
              {FIXTURE_LIST.filter(f => f.leg === 2).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
                const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
                return (
                  <div
                    key={fixture.id}
                    onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                    className={`px-5 py-4 bg-white/5 rounded-2xl flex items-center justify-between ${!result ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}`}
                  >
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={result?.winner === t1.name ? 'text-indigo-400' : 'text-slate-400'}><TeamIcon name={t1.name} size={18} /></div>
                        <span className={`font-semibold text-sm ${result?.winner === t1.name ? 'text-white' : 'text-slate-300'}`}>{t1.name}</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Home</span>
                    </div>
                    <div className="text-center px-4 flex-shrink-0">
                      {result ? (
                        <div className="text-center bg-black/40 px-3 py-1.5 rounded-xl">
                          <p className="text-lg font-semibold text-white leading-none">{result.score1}–{result.score2}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">vs</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-1">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className={result?.winner === t2.name ? 'text-indigo-400' : 'text-slate-400'}><TeamIcon name={t2.name} size={18} /></div>
                        <span className={`font-semibold text-sm ${result?.winner === t2.name ? 'text-white' : 'text-slate-300'}`}>{t2.name}</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Away</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Playoffs</p>
            <div className="flex flex-col gap-3">
              <div className="px-5 py-5 bg-white/5 rounded-2xl">
                <p className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wide">Qualifier <span className="text-slate-600 ml-1 normal-case font-medium">(2nd vs 3rd)</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-300"><TeamIcon name={standings[1]?.name ?? ''} size={20} /></div>
                      <span className="font-semibold text-lg text-white">{standings[1]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1">Home</span>
                  </div>
                  <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">VS</span>
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <div className="text-slate-300"><TeamIcon name={standings[2]?.name ?? ''} size={20} /></div>
                      <span className="font-semibold text-lg text-white">{standings[2]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1">Away</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 bg-indigo-600 rounded-2xl">
                <p className="text-xs font-semibold text-white mb-4 uppercase tracking-wide">Grand Final <span className="text-indigo-200 ml-1 normal-case font-medium">(1st vs Q Winner)</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-white"><TeamIcon name={standings[0]?.name ?? ''} size={20} /></div>
                      <span className="font-semibold text-lg text-white">{standings[0]?.name ?? 'TBD'}</span>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase mt-1">Home</span>
                  </div>
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">VS</span>
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <div className="text-white"><Trophy size={20} /></div>
                      <span className="font-medium text-lg text-white">Winner</span>
                    </div>
                    <span className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase mt-1">Away</span>
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
            <div className="bg-white/5 rounded-[2rem] p-2">
              <div className="grid grid-cols-6 px-4 py-4 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                <div className="col-span-3">Team</div>
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-right">PTS</div>
              </div>
              <div className="flex flex-col gap-1">
                {standings.map((team: any, idx) => (
                  <div key={team.name} className="grid grid-cols-6 px-4 py-4 items-center bg-black/40 rounded-3xl hover:bg-white/5 transition-colors">
                    <div className="col-span-3 flex items-center gap-4">
                      <span className="text-xs font-semibold text-slate-500 w-3">{idx + 1}</span>
                      <div className="text-slate-300">
                        <TeamIcon name={team.name} size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold tracking-tight text-white truncate">{team.full || team.name}</span>
                        <div className="flex gap-1.5 mt-2">
                          {team.form.slice(-5).map((res: string, i: number) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${res === 'W' ? 'bg-indigo-500' : 'bg-white/20'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm font-medium text-slate-400">{team.p}</div>
                    <div className="text-center text-sm font-medium text-slate-400">{team.w}</div>
                    <div className="text-right font-semibold text-lg text-white">{team.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6">
            <h4 className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Performance Highlights</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-6 py-6 bg-white/5 rounded-3xl">
                <div className="flex items-center gap-5">
                  <Flame size={24} className="text-orange-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">On Fire</p>
                    <p className="font-semibold text-base text-white">{onFire ? onFire.name : standings[0]?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="bg-black/50 px-4 py-2 rounded-2xl">
                  <span className="text-lg font-semibold text-white">{standings[0]?.pts ?? 0} pts</span>
                </div>
              </div>
              <div className="flex justify-between items-center px-6 py-6 bg-white/5 rounded-3xl">
                <div className="flex items-center gap-5">
                  <TrendingUp size={24} className="text-indigo-400" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bottlers</p>
                    <p className="font-semibold text-base text-white">{bottler ? bottler.name : standings[standings.length - 1]?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="bg-black/50 px-4 py-2 rounded-2xl">
                  <span className="text-lg font-semibold text-white">{bottler?.l ?? 0} L</span>
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
            <div className="p-8 text-center bg-white/5 rounded-3xl">
              <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2 uppercase">Played</p>
              <p className="text-5xl font-semibold text-indigo-400">{matches.length}</p>
            </div>
            <div className="p-8 text-center bg-white/5 rounded-3xl">
              <p className="text-xs font-semibold text-slate-500 tracking-wide mb-2 uppercase">Remaining</p>
              <p className="text-5xl font-semibold text-slate-300">{Math.max(0, 20 - matches.length)}</p>
            </div>
          </div>

          <div className="px-6 mb-8">
            <h4 className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Teams &amp; Owners</h4>
            <div className="flex flex-col gap-3">
              {standings.map((t: any) => (
                <div key={t.name} className="px-6 py-5 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-slate-300"><TeamIcon name={t.name} size={20} /></div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.full || t.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Owner: <span className="text-slate-300 font-medium">{t.owner || '—'}</span></p>
                      </div>
                    </div>
                    <div className="text-right bg-black/40 px-4 py-2 rounded-2xl">
                      <p className="text-base font-semibold text-white">{t.pts} pts</p>
                      <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase mt-1">{t.w}W {t.l}L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 bg-black/30 p-2.5 rounded-xl">
                    <MapPin size={12} className="text-slate-600 flex-shrink-0 ml-1" />
                    <p className="text-xs text-slate-400 font-medium">{t.ground || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6">
            <h4 className="text-[10px] font-semibold tracking-widest text-slate-500 mb-3 uppercase">Achievement</h4>
            <div className="flex items-center gap-5 px-6 py-6 bg-indigo-600/20 rounded-3xl">
              <div className="text-indigo-400"><Trophy size={28} strokeWidth={1.5} /></div>
              <div>
                <p className="text-sm font-semibold text-white">RCB Owner</p>
                <p className="text-xs font-medium text-slate-400 mt-1">We will win it this year 🔴</p>
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
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
      >
        <Plus size={24} strokeWidth={2} />
      </button>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-lg flex items-start pt-3 justify-around px-4 z-40 rounded-t-[2.5rem]">
        <button onClick={() => setActiveTab('home')} className={`p-2 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'home' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}>
          <Calendar size={22} strokeWidth={activeTab === 'home' ? 2 : 1.5} />
        </button>
        <button onClick={() => setActiveTab('fixtures')} className={`p-2 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'fixtures' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}>
          <ListChecks size={22} strokeWidth={activeTab === 'fixtures' ? 2 : 1.5} />
        </button>
        <button onClick={() => setActiveTab('standings')} className={`p-2 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'standings' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}>
          <Trophy size={22} strokeWidth={activeTab === 'standings' ? 2 : 1.5} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-2 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}>
          <User size={22} strokeWidth={activeTab === 'profile' ? 2 : 1.5} />
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

  const sel = "w-full bg-white/5 py-4 px-4 rounded-2xl text-white text-base font-medium outline-none focus:bg-white/10 transition-colors appearance-none";
  const inp = "w-full bg-white/5 py-4 px-4 rounded-2xl text-white text-base font-medium outline-none focus:bg-white/10 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black rounded-t-[2.5rem] border-t border-white/10 p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Score Card</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><X size={24} strokeWidth={1.5} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="bg-white/5 p-5 rounded-3xl space-y-4">
              <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Team 1 (Batting First)</p>
              <select value={team1} onChange={e => setTeam1(e.target.value)} className={sel} required>
                <option value="" className="bg-black text-slate-400">Select team…</option>
                {teams.filter(t => t.name !== team2).map(t => <option key={t.id} value={t.name} className="bg-black text-white">{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 54)" value={score1} onChange={e => setScore1(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
            <div className="bg-white/5 p-5 rounded-3xl space-y-4">
              <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Team 2 (Chasing)</p>
              <select value={team2} onChange={e => setTeam2(e.target.value)} className={sel} required>
                <option value="" className="bg-black text-slate-400">Select team…</option>
                {teams.filter(t => t.name !== team1).map(t => <option key={t.id} value={t.name} className="bg-black text-white">{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 55)" value={score2} onChange={e => setScore2(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
          </div>
          <div className="pt-4">
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 bg-indigo-500/10 p-4 rounded-2xl"><span className="text-indigo-400 font-semibold mr-1">Live Sync.</span>Standings update instantly for all players the moment you publish.</p>
            <button
              type="submit"
              disabled={submitting || !team1 || !team2 || !score1 || !score2 || team1 === team2}
              className="w-full py-5 bg-indigo-600 rounded-[2rem] text-white font-semibold hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
            >
              {submitting ? 'Publishing…' : 'Publish Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
