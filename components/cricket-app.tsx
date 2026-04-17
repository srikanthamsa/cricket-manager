'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Calendar, User, Plus, MapPin,
  Flame, Skull, TrendingUp, Settings, X, ListChecks,
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

/* ─── Header sub-component ───────────────────────────────────────────────── */
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="px-6 pt-8 pb-4">
    <div className="flex justify-between items-center mb-2">
      <div className="p-2 bg-white rounded-full shadow-sm">
        <Settings size={18} className="text-gray-400" />
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Srikant" alt="Avatar" />
      </div>
    </div>
    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{subtitle}</h2>
    <h1 className="text-4xl font-black text-gray-900 leading-none uppercase tracking-tight">{title}</h1>
  </div>
);

/* ─── Setup screen ───────────────────────────────────────────────────────── */
function SetupScreen() {
  return (
    <div className="min-h-screen bg-[#F2F1EB] flex flex-col items-center justify-center px-8 text-center">
      <div className="text-6xl mb-6">🏏</div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">Setup Required</h1>
      <p className="text-sm text-gray-500 font-medium mb-8 max-w-xs leading-relaxed">
        Add your Supabase credentials to{' '}
        <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">.env.local</code>{' '}
        to enable real-time sync.
      </p>
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm text-left space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Steps</p>
        {[
          'Create a Supabase project at supabase.com',
          'Run supabase/schema.sql in the SQL editor',
          'Copy .env.local.example → .env.local',
          'Fill in SUPABASE_URL and SUPABASE_ANON_KEY',
          'Restart the dev server',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#7B8E45] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-xs text-gray-600 font-medium leading-snug">{s}</p>
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
      <div className="h-screen w-full bg-[#F2F1EB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B8E45]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1EB] font-sans pb-28 max-w-md mx-auto relative overflow-x-hidden shadow-2xl">

      {/* ── Hero banner (home only) ── */}
      {activeTab === 'home' && (
        <div className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover"
            alt="Cricket ground"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Mini IPL · 5-Over League</p>
            <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none mb-3">
              All Matches
            </h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#7B8E45] rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                {matches.length}/20 played
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                {20 - matches.length} remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ HOME ══════════════════ */}
      {activeTab === 'home' && (
        <div className="px-6 pt-6 space-y-8">
          {/* Season card */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl">
            <div className="relative h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover"
                alt="match"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-[#7B8E45] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                Season Active
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-2xl font-black mb-1 text-gray-900">Mini IPL 5-Over League</h4>
              <p className="text-gray-400 text-sm mb-5 leading-tight">
                The legendary 5-over derby. High intensity, questionable sportsmanship.
              </p>
              {nextFixture ? (
                <button
                  onClick={() => openScoreModal(nextFixture.team1, nextFixture.team2)}
                  className="w-full py-4 bg-[#7B8E45] text-white font-black uppercase tracking-widest rounded-2xl flex flex-col items-center justify-center gap-0.5 hover:bg-[#6a7a3b] active:scale-95 transition-all"
                >
                  <span className="flex items-center gap-2"><Plus size={18} /> Record Result</span>
                  <span className="text-[10px] font-bold tracking-widest opacity-75 normal-case">{nextFixture.team1} vs {nextFixture.team2}</span>
                </button>
              ) : (
                <div className="w-full py-4 bg-gray-100 text-gray-400 font-black uppercase tracking-widest rounded-2xl text-center text-sm">
                  All 20 matches played 🏆
                </div>
              )}
            </div>
          </div>

          {/* Recent results */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-gray-900">Recent Results</h3>
            <div className="space-y-3">
              {matches.length === 0 ? (
                <div className="p-8 bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No matches played yet
                </div>
              ) : (
                matches.slice(0, 10).map(m => (
                  <div key={m.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[10px] transition-opacity ${m.winner === m.team1 ? 'opacity-100' : 'opacity-30'}`}
                          style={{ backgroundColor: FALLBACK_TEAMS.find(t => t.name === m.team1)?.color || '#888' }}
                        >
                          {m.team1}
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-gray-500">{m.score1}</span>
                      </div>
                      <span className="text-xs font-black text-gray-300 italic">VS</span>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[10px] transition-opacity ${m.winner === m.team2 ? 'opacity-100' : 'opacity-30'}`}
                          style={{ backgroundColor: FALLBACK_TEAMS.find(t => t.name === m.team2)?.color || '#888' }}
                        >
                          {m.team2}
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-gray-500">{m.score2}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#7B8E45] mb-1">{m.winner} Won</p>
                      <p className="text-[9px] font-bold uppercase text-gray-400">{new Date(m.timestamp).toLocaleDateString()}</p>
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
        <div className="px-6 pb-12">
          <Header subtitle="Group Stage · Playoffs" title="Fixtures" />

          {/* Leg 1 */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 mt-2">Leg 1 — First Round</p>
          <div className="space-y-2 mb-8">
            {FIXTURE_LIST.filter(f => f.leg === 1).map(fixture => {
              const result = getFixtureResult(fixture, matches);
              const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
              const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
              return (
                <div
                  key={fixture.id}
                  onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                  className={`bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between ${!result ? 'cursor-pointer active:scale-[0.98] hover:shadow-md transition-all' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: t1.color }}>{t1.name}</div>
                    <span className="font-black text-xs uppercase text-gray-800">{t1.name}</span>
                  </div>
                  <div className="text-center px-3 flex-shrink-0">
                    {result ? (
                      <div className="text-center">
                        <p className="text-base font-black text-gray-900 leading-none">{result.score1}–{result.score2}</p>
                        <p className="text-[9px] font-black uppercase text-[#7B8E45] mt-0.5">{result.winner} won</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-black text-gray-300 uppercase">vs</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5">Tap to add</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: t2.color }}>{t2.name}</div>
                    <span className="font-black text-xs uppercase text-gray-800">{t2.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leg 2 */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Leg 2 — Return Fixtures</p>
          <div className="space-y-2 mb-8">
            {FIXTURE_LIST.filter(f => f.leg === 2).map(fixture => {
              const result = getFixtureResult(fixture, matches);
              const t1 = FALLBACK_TEAMS.find(t => t.name === fixture.team1)!;
              const t2 = FALLBACK_TEAMS.find(t => t.name === fixture.team2)!;
              return (
                <div
                  key={fixture.id}
                  onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}
                  className={`bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between ${!result ? 'cursor-pointer active:scale-[0.98] hover:shadow-md transition-all' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: t1.color }}>{t1.name}</div>
                    <span className="font-black text-xs uppercase text-gray-800">{t1.name}</span>
                  </div>
                  <div className="text-center px-3 flex-shrink-0">
                    {result ? (
                      <div className="text-center">
                        <p className="text-base font-black text-gray-900 leading-none">{result.score1}–{result.score2}</p>
                        <p className="text-[9px] font-black uppercase text-[#7B8E45] mt-0.5">{result.winner} won</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-black text-gray-300 uppercase">vs</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase mt-0.5">Tap to add</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: t2.color }}>{t2.name}</div>
                    <span className="font-black text-xs uppercase text-gray-800">{t2.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playoffs */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Playoffs</p>
          <div className="space-y-3">
            {/* Qualifier */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Qualifier</p>
              <p className="text-xs font-black uppercase text-white mb-4">2nd Place vs 3rd Place</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white/20"
                    style={{ backgroundColor: standings[1]?.color || '#555' }}>
                    {standings[1]?.name ?? '?'}
                  </div>
                  <span className="font-black text-sm uppercase text-white">{standings[1]?.name ?? 'TBD'}</span>
                </div>
                <span className="text-gray-600 font-black text-sm">VS</span>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white/20"
                    style={{ backgroundColor: standings[2]?.color || '#555' }}>
                    {standings[2]?.name ?? '?'}
                  </div>
                  <span className="font-black text-sm uppercase text-white">{standings[2]?.name ?? 'TBD'}</span>
                </div>
              </div>
            </div>
            {/* Final */}
            <div className="bg-[#7B8E45] rounded-2xl p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Final</p>
              <p className="text-xs font-black uppercase text-white mb-4">1st Place vs Qualifier Winner</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white/40"
                    style={{ backgroundColor: standings[0]?.color || '#555' }}>
                    {standings[0]?.name ?? '?'}
                  </div>
                  <span className="font-black text-sm uppercase text-white">{standings[0]?.name ?? 'TBD'}</span>
                </div>
                <span className="text-white/40 font-black text-sm">VS</span>
                <div className="bg-white/20 px-3 py-1.5 rounded-full">
                  <span className="font-black text-xs uppercase text-white">Q Winner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ STANDINGS ══════════════════ */}
      {activeTab === 'standings' && (
        <div className="px-6">
          <Header subtitle="Championship" title="Standings" />
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="grid grid-cols-6 p-6 bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <div className="col-span-3">Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">PTS</div>
            </div>
            {standings.map((team: any, idx) => (
              <div key={team.name} className="grid grid-cols-6 p-5 items-center border-b border-gray-50 last:border-0">
                <div className="col-span-3 flex items-center gap-3">
                  <span className="text-xs font-black text-gray-300 w-4">{idx + 1}</span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 leading-none"
                    style={{ backgroundColor: team.color }}>
                    {team.name}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black uppercase tracking-tight text-gray-900 truncate">{team.full || team.name}</span>
                    <div className="flex gap-1 mt-1">
                      {team.form.slice(-5).map((res: string, i: number) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${res === 'W' ? 'bg-[#7B8E45]' : 'bg-red-400'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center font-bold text-gray-600">{team.p}</div>
                <div className="text-center font-bold text-gray-600">{team.w}</div>
                <div className="text-center font-black text-lg text-gray-900">{team.pts}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1A1A] text-white p-8 rounded-[2.5rem] relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Skull size={100} /></div>
            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Power Rankings</h4>
              <p className="text-2xl font-black mb-4 uppercase leading-none">The Shame Board</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Flame className="text-orange-500" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">On Fire</p>
                      <p className="font-black uppercase tracking-tight text-white">{onFire ? onFire.name : standings[0]?.name ?? '—'}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">{standings[0]?.pts ?? 0} pts</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-blue-400" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Bottlers</p>
                      <p className="font-black uppercase tracking-tight text-white">{bottler ? bottler.name : standings[standings.length - 1]?.name ?? '—'}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">{bottler?.l ?? 0} L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ PROFILE ══════════════════ */}
      {activeTab === 'profile' && (
        <div className="px-6 pb-12">
          <Header subtitle="RCB Owner · Your Stats" title="Captain Srikant" />
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Played</p>
              <p className="text-4xl font-black text-[#7B8E45]">{matches.length}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Left</p>
              <p className="text-4xl font-black text-[#7B8E45]">{Math.max(0, 20 - matches.length)}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm mb-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Teams &amp; Owners</h4>
            <div className="space-y-3">
              {standings.map((t: any) => (
                <div key={t.name} className="bg-[#F2F1EB] p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                        style={{ backgroundColor: t.color }}>
                        {t.name}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight text-gray-900">{t.full || t.name}</p>
                        <p className="text-[10px] font-bold text-gray-500">Owner: <span className="text-gray-700 font-black">{t.owner || '—'}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-gray-900">{t.pts} pts</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{t.w}W {t.l}L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                    <p className="text-[10px] text-gray-500 font-medium">{t.ground || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Achievement Unlocked</h4>
            <div className="flex items-center gap-4 bg-[#F2F1EB] p-4 rounded-2xl">
              <div className="bg-[#EC1C24] p-3 rounded-full text-white flex-shrink-0"><Trophy size={20} /></div>
              <div>
                <p className="text-xs font-black uppercase text-gray-900">RCB Owner</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">We will win it this year 🔴</p>
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
        className="fixed bottom-28 right-6 w-14 h-14 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 active:scale-90 transition-all"
      >
        <Plus size={26} />
      </button>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-16 bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-full shadow-2xl flex items-center justify-around px-4 z-40">
        <button onClick={() => setActiveTab('home')} className={`p-2 flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'home' ? 'text-[#7B8E45]' : 'text-gray-400'}`}>
          <Calendar size={22} />
        </button>
        <button onClick={() => setActiveTab('fixtures')} className={`p-2 flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'fixtures' ? 'text-[#7B8E45]' : 'text-gray-400'}`}>
          <ListChecks size={22} />
        </button>
        <button onClick={() => setActiveTab('standings')} className={`p-2 flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'standings' ? 'text-[#7B8E45]' : 'text-gray-400'}`}>
          <Trophy size={22} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-2 flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'profile' ? 'text-[#7B8E45]' : 'text-gray-400'}`}>
          <User size={22} />
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

  const sel = "w-full bg-[#F2F1EB] px-4 py-3 rounded-xl font-bold uppercase tracking-tight outline-none focus:ring-2 ring-[#7B8E45]/50 text-sm text-gray-900 border border-gray-200";
  const inp = "w-full bg-[#F2F1EB] px-4 py-3 rounded-xl font-bold outline-none focus:ring-2 ring-[#7B8E45]/50 text-sm text-gray-900 border border-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Score Card</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-5 bg-[#F2F1EB] rounded-3xl space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Team 1 (Batting First)</p>
              <select value={team1} onChange={e => setTeam1(e.target.value)} className={sel} required>
                <option value="">Select team…</option>
                {teams.filter(t => t.name !== team2).map(t => <option key={t.id} value={t.name}>{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 54)" value={score1} onChange={e => setScore1(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
            <div className="p-5 bg-[#F2F1EB] rounded-3xl space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Team 2 (Chasing)</p>
              <select value={team2} onChange={e => setTeam2(e.target.value)} className={sel} required>
                <option value="">Select team…</option>
                {teams.filter(t => t.name !== team1).map(t => <option key={t.id} value={t.name}>{t.full_name || t.full || t.name}</option>)}
              </select>
              <input type="number" placeholder="Total Runs (e.g. 55)" value={score2} onChange={e => setScore2(e.target.value)} className={inp} required inputMode="numeric" />
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-3xl">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-gray-500">Match Insight</p>
              <p className="text-xs font-black text-[#7B8E45] uppercase">Live Sync</p>
            </div>
            <p className="text-white text-sm font-bold leading-relaxed">Standings update in real-time for all players the moment you publish.</p>
          </div>
          <button
            type="submit"
            disabled={submitting || !team1 || !team2 || !score1 || !score2 || team1 === team2}
            className="w-full py-5 bg-[#7B8E45] text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
          >
            {submitting ? 'Publishing…' : 'Publish Result'}
          </button>
        </form>
      </div>
    </div>
  );
}
