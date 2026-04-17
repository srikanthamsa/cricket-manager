'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  { id: 'rcb', name: 'RCB', full: 'Royal Challengers Bengaluru', color: '#ff3366', owner: 'Srikant',  ground: 'M. Chinnaswamy Stadium, Bengaluru' },
  { id: 'csk', name: 'CSK', full: 'Chennai Super Kings',         color: '#ffff00', owner: 'KVD',      ground: 'MA Chidambaram Stadium, Chennai' },
  { id: 'mi',  name: 'MI',  full: 'Mumbai Indians',              color: '#00d4ff', owner: 'Debu',     ground: 'Wankhede Stadium, Mumbai' },
  { id: 'kkr', name: 'KKR', full: 'Kolkata Knight Riders',       color: '#ff00ff', owner: 'Ekansh',   ground: 'Eden Gardens, Kolkata' },
  { id: 'srh', name: 'SRH', full: 'Sunrisers Hyderabad',         color: '#ff7700', owner: 'Ashpak',   ground: 'Rajiv Gandhi Intl. Stadium, Hyderabad' },
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

const TeamBadge = ({ name }: { name: string }) => {
  const team = FALLBACK_TEAMS.find(t => t.name === name);
  return (
    <div 
      className="w-2 h-full absolute left-0 top-0 border-r border-[var(--border)]"
      style={{ backgroundColor: team?.color || 'var(--muted)', boxShadow: `0 0 5px ${team?.color}40` }}
    />
  );
};

/* ─── Setup screen ───────────────────────────────────────────────────────── */
function SetupScreen() {
  return (
    <div className="min-h-screen bg-[var(--background)] bg-circuit flex flex-col items-center justify-center p-4">
      <div className="bg-[var(--card)] p-8 w-full max-w-lg border border-[var(--destructive)] cyber-chamfer shadow-neon-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--destructive)]"></div>
        <h1 className="font-orbitron text-3xl font-black text-[var(--destructive)] uppercase mb-4 tracking-widest text-glitch">SYS_ERR: DB_LINK_FAIL</h1>
        <div className="font-mono text-sm text-[var(--foreground)] space-y-4">
          <p className="opacity-80">&gt; Establishing secure connection to Supabase mainframe...</p>
          <p className="text-[var(--destructive)]">&gt; CONNECTION REFUSED. CREDENTIALS MISSING.</p>
          <p className="opacity-80 mt-6">&gt; Action required: Inject variables into <span className="text-[var(--accent-tertiary)] border border-[var(--accent-tertiary)] px-2 py-0.5 cyber-chamfer-sm bg-[var(--accent-tertiary)]/10">.env.local</span></p>
          <p className="text-xs text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)] mt-6">
            Awaiting input<span className="animate-blink inline-block w-2 h-3 bg-[var(--accent)] ml-1 align-middle"></span>
          </p>
        </div>
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
  const [activeTab, setActiveTab] = useState<'home' | 'scores' | 'standings' | 'profile'>('home');
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>(FALLBACK_TEAMS);
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [prefillTeams, setPrefillTeams] = useState<{ t1: string; t2: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cm_user_id');
    if (saved) setCurrentUser(saved);
    setAuthChecked(true);
  }, []);

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
        (payload) => setMatches(prev => prev.some(m => m.id === payload.new.id) ? prev : [payload.new as any, ...prev])
      )
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
  }, []);

  /* Standings */
  const standings = useMemo(() => {
    const stats: Record<string, any> = {};
    teams.forEach(t => {
      stats[t.name] = { ...t, p: 0, w: 0, l: 0, pts: 0, form: [], runsScored: 0, runsConceded: 0, nrr: 0 };
    });
    matches.forEach(m => {
      const t1 = stats[m.team1];
      const t2 = stats[m.team2];
      if (!t1 || !t2) return;
      t1.p++; t2.p++;
      t1.runsScored += m.score1; t1.runsConceded += m.score2;
      t2.runsScored += m.score2; t2.runsConceded += m.score1;
      if (m.winner === m.team1) {
        t1.w++; t1.pts += 2; t1.form.push('W');
        t2.l++; t2.form.push('L');
      } else {
        t2.w++; t2.pts += 2; t2.form.push('W');
        t1.l++; t1.form.push('L');
      }
    });
    Object.values(stats).forEach(t => {
      t.nrr = t.p > 0 ? ((t.runsScored - t.runsConceded) / (t.p * 5)).toFixed(2) : "0.00";
    });
    return Object.values(stats).sort((a: any, b: any) => b.pts - a.pts || parseFloat(b.nrr) - parseFloat(a.nrr) || b.w - a.w);
  }, [matches, teams]);

  const onFire = standings.find((t: any) => t.form.length >= 3 && t.form.slice(-3).every((r: string) => r === 'W'));
  const bottler = standings.slice().reverse().find((t: any) => t.form.length >= 2 && t.form.slice(-2).every((r: string) => r === 'L'));

  const highestScore = useMemo(() => {
    if (!matches.length) return null;
    let max = { team: '', score: 0 };
    matches.forEach(m => {
      if (m.score1 > max.score) max = { team: m.team1, score: m.score1 };
      if (m.score2 > max.score) max = { team: m.team2, score: m.score2 };
    });
    return max.score > 0 ? max : null;
  }, [matches]);

  const biggestDestruction = useMemo(() => {
    if (!matches.length) return null;
    let maxDiff = 0;
    let details = { winner: '', loser: '', diff: 0 };
    matches.forEach(m => {
      const diff = Math.abs(m.score1 - m.score2);
      if (diff > maxDiff) {
        maxDiff = diff;
        details = { winner: m.winner, loser: m.winner === m.team1 ? m.team2 : m.team1, diff };
      }
    });
    return maxDiff > 0 ? details : null;
  }, [matches]);

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

  if (loading || !authChecked) {
    return (
      <div className="h-screen w-full bg-[var(--background)] flex flex-col items-center justify-center font-mono">
        <div className="text-[var(--accent)] text-lg uppercase tracking-widest flex items-center">
          &gt; init_sys<span className="animate-blink inline-block w-2.5 h-4 bg-[var(--accent)] ml-2"></span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen teams={teams} onSelect={(id) => {
       localStorage.setItem('cm_user_id', id);
       setCurrentUser(id);
    }} />
  }

  const myTeam = teams.find(t => t.name === currentUser) || teams[0];

  return (
    <div className="min-h-screen bg-[var(--background)] bg-circuit font-mono pb-24 max-w-4xl mx-auto relative text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-black">

      {/* ── HEADER ── */}
      <header className="px-6 py-8 border-b border-[var(--border)] relative overflow-hidden bg-[var(--background)]/80 backdrop-blur-md z-30 sticky top-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-tertiary)] to-[var(--accent-secondary)]"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-share-tech text-[var(--accent)] uppercase tracking-[0.3em] mb-1 opacity-80">// NEON_LEAGUE_V1</p>
            <h1 className="font-orbitron text-4xl font-black uppercase tracking-widest text-[var(--foreground)] drop-shadow-neon text-glitch">
              MINI IPL
            </h1>
          </div>
          <button 
            onClick={() => nextFixture ? openScoreModal(nextFixture.team1, nextFixture.team2) : openScoreModal()}
            className="hidden md:flex items-center bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] px-4 py-2 cyber-chamfer-sm text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black hover:shadow-neon transition-all cyber-glitch"
          >
            [+] UPLOAD_SCORE
          </button>
        </div>
      </header>

      {/* ── NAVIGATION ── */}
      <nav className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm sticky top-[108px] z-20">
        <div className="flex overflow-x-auto hide-scrollbar">
          {(['home', 'scores', 'standings', 'profile'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap px-6 transition-all border-b-2 ${
                activeTab === t 
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 shadow-[inset_0_-2px_10px_rgba(0,255,136,0.2)]' 
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
              }`}
            >
              /{t}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-6 space-y-8 animate-in fade-in duration-300">
        
        {/* ══════════════════ HOME ══════════════════ */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* HERO HUD */}
            <div className="bg-[var(--card)] border border-[var(--border)] p-1 cyber-chamfer relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-[var(--accent)]/10 border border-[var(--accent)] cyber-chamfer-sm grid place-items-center">
                  <div className="w-8 h-8 border border-[var(--accent)] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
              </div>
              <div className="bg-[var(--muted)]/30 border border-[var(--border)] p-6 cyber-chamfer h-full">
                <p className="text-[10px] text-[var(--accent-tertiary)] uppercase tracking-[0.2em] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[var(--accent-tertiary)] mr-2 animate-pulse"></span>
                  SYSTEM.STATUS // ACTIVE
                </p>
                <h2 className="font-orbitron text-2xl md:text-4xl font-bold uppercase text-[var(--foreground)] mb-6 leading-tight">
                  <span className="text-[var(--accent)]">5-OVER</span> DEATHMATCH<br/>PROTOCOL INITIATED
                </h2>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between border-t border-[var(--border)]/50 pt-6 mt-4">
                  <div className="font-share-tech">
                    <p className="text-xs text-[var(--muted-foreground)] uppercase">Data Progression</p>
                    <p className="text-xl text-[var(--foreground)]">{matches.length} <span className="text-sm text-[var(--muted-foreground)]">/ 20 FILES PROCESSED</span></p>
                  </div>
                  
                  {nextFixture ? (
                    <button
                      onClick={() => openScoreModal(nextFixture.team1, nextFixture.team2)}
                      className="bg-transparent border border-[var(--accent-secondary)] text-[var(--accent-secondary)] px-6 py-3 cyber-chamfer-sm text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent-secondary)] hover:text-black hover:shadow-neon-secondary transition-all flex items-center justify-center gap-2 cyber-glitch"
                    >
                      &gt; EXECUTE: {nextFixture.team1}_VS_{nextFixture.team2}
                    </button>
                  ) : (
                    <div className="text-[var(--accent)] text-sm font-bold uppercase tracking-widest border border-[var(--accent)] px-4 py-2 cyber-chamfer-sm bg-[var(--accent)]/10">
                      ALL_DATA_CORRUPTED // LEAGUE_COMPLETE
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RECENT FEED */}
            <div>
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-4 flex items-center">
                <span className="w-1 h-4 bg-[var(--accent)] mr-2"></span> DATA_LOG.RECENT
              </h3>
              
              {matches.length === 0 ? (
                <div className="bg-[var(--card)] border border-[var(--border)] p-8 text-center text-[var(--muted-foreground)] text-sm cyber-chamfer font-share-tech">
                  NO_LOGS_FOUND
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.slice(0, 6).map((m, i) => (
                    <div key={m.id} className={`bg-[var(--card)] border border-[var(--border)] p-4 relative cyber-chamfer-sm hover:-translate-y-1 hover:border-[var(--accent)]/50 transition-all ${i % 2 === 0 ? 'md:-skew-x-2' : 'md:skew-x-2'}`}>
                      <TeamBadge name={m.winner} />
                      <div className="flex justify-between items-center mb-4 pl-4 border-b border-[var(--border)] pb-2">
                        <span className="text-[9px] text-[var(--muted-foreground)] font-share-tech uppercase tracking-widest">
                          TS: {new Date(m.timestamp).getTime()}
                        </span>
                        <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 border border-[var(--accent)]/30 uppercase">MATCH_FINAL</span>
                      </div>
                      
                      <div className="pl-4 space-y-3">
                        <div className={`flex justify-between items-center ${m.winner === m.team1 ? 'opacity-100' : 'opacity-50'}`}>
                          <span className={`font-orbitron font-bold text-lg tracking-widest ${m.winner === m.team1 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{m.team1}</span>
                          <span className={`font-mono text-xl ${m.winner === m.team1 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}`}>{m.score1}</span>
                        </div>
                        <div className={`flex justify-between items-center ${m.winner === m.team2 ? 'opacity-100' : 'opacity-50'}`}>
                          <span className={`font-orbitron font-bold text-lg tracking-widest ${m.winner === m.team2 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{m.team2}</span>
                          <span className={`font-mono text-xl ${m.winner === m.team2 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}`}>{m.score2}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════ SCORES ══════════════════ */}
        {activeTab === 'scores' && (
          <div className="space-y-8">
            {/* TERMINAL HEADER */}
            <div className="bg-[var(--card)] border border-[var(--border)] p-4 cyber-chamfer-sm flex items-center justify-between">
              <div className="font-share-tech text-sm text-[var(--accent-tertiary)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="ml-2 uppercase tracking-widest">root@system:~/fixtures$ ls -la</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center">
                <span className="text-[var(--accent)] mr-2">#</span> PHASE_1_EXECUTION
              </h3>
              
              <div className="space-y-3">
                {FIXTURE_LIST.filter(f => f.leg === 1).map(fixture => {
                  const result = getFixtureResult(fixture, matches);
                  return (
                    <div key={fixture.id} onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)} className="bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors cyber-chamfer-sm relative group overflow-hidden cursor-pointer">
                      {!result && <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>}
                      <div className="relative z-10 flex flex-col p-4">
                        <div className="w-full flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]/50">
                          <div className="font-share-tech text-[10px] text-[var(--muted-foreground)] uppercase flex items-center gap-2">
                             {result ? <span className="text-[var(--accent-secondary)]">COMPLETED</span> : <span className="text-[var(--accent)] animate-pulse">PENDING</span>}
                             <span className="opacity-50 hidden sm:inline">// LOC: {teams.find((t: any) => t.name === fixture.team1)?.ground || 'UNKNOWN'}</span>
                          </div>
                          {!result && <span className="text-[var(--accent)] font-bold opacity-0 group-hover:opacity-100 transition-opacity">&gt;_</span>}
                        </div>
                        
                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-8 px-4 border-l border-[var(--accent)]/30">
                          <div className={`flex justify-between md:justify-start items-center gap-4 flex-1 ${result && result.winner !== fixture.team1 ? 'opacity-40' : ''}`}>
                            <span className={`font-orbitron font-bold tracking-widest ${result && result.winner === fixture.team1 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{fixture.team1}</span>
                            {result && <span className="font-mono text-lg">{result.score1}</span>}
                          </div>
                          
                          <div className="text-[10px] text-[var(--muted-foreground)] font-share-tech">VS</div>
                          
                          <div className={`flex justify-between md:justify-end items-center gap-4 flex-1 md:flex-row-reverse ${result && result.winner !== fixture.team2 ? 'opacity-40' : ''}`}>
                            <span className={`font-orbitron font-bold tracking-widest ${result && result.winner === fixture.team2 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{fixture.team2}</span>
                            {result && <span className="font-mono text-lg">{result.score2}</span>}
                          </div>
                        </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)] border-dashed">
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center">
                <span className="text-[var(--accent)] mr-2">#</span> PHASE_2_EXECUTION
              </h3>
              
              <div className="space-y-3">
                {FIXTURE_LIST.filter(f => f.leg === 2).map(fixture => {
                  const result = getFixtureResult(fixture, matches);
                  return (
                    <div key={fixture.id} onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)} className="bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors cyber-chamfer-sm relative group overflow-hidden cursor-pointer">
                      <div className="relative z-10 flex flex-col p-4">
                        <div className="w-full flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]/50">
                          <div className="font-share-tech text-[10px] text-[var(--muted-foreground)] uppercase flex items-center gap-2">
                             {result ? <span className="text-[var(--accent-secondary)]">COMPLETED</span> : <span className="text-[var(--accent)]">PENDING</span>}
                             <span className="opacity-50 hidden sm:inline">// LOC: {teams.find((t: any) => t.name === fixture.team1)?.ground || 'UNKNOWN'}</span>
                          </div>
                          {!result && <span className="text-[var(--accent)] font-bold opacity-0 group-hover:opacity-100 transition-opacity">&gt;_</span>}
                        </div>
                        
                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-8 px-4 border-l border-[var(--accent)]/30">
                          <div className={`flex justify-between md:justify-start items-center gap-4 flex-1 ${result && result.winner !== fixture.team1 ? 'opacity-40' : ''}`}>
                            <span className={`font-orbitron font-bold tracking-widest ${result && result.winner === fixture.team1 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{fixture.team1}</span>
                            {result && <span className="font-mono text-lg">{result.score1}</span>}
                          </div>
                          
                          <div className="text-[10px] text-[var(--muted-foreground)] font-share-tech">VS</div>
                          
                          <div className={`flex justify-between md:justify-end items-center gap-4 flex-1 md:flex-row-reverse ${result && result.winner !== fixture.team2 ? 'opacity-40' : ''}`}>
                            <span className={`font-orbitron font-bold tracking-widest ${result && result.winner === fixture.team2 ? 'text-[var(--accent)] drop-shadow-neon' : 'text-[var(--foreground)]'}`}>{fixture.team2}</span>
                            {result && <span className="font-mono text-lg">{result.score2}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)] border-dashed">
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center">
                <span className="text-[var(--destructive)] mr-2">!</span> PHASE_3_FINAL_EXEC
              </h3>
              <div className="space-y-3">
                <div className="bg-[var(--card)] border border-[var(--accent-tertiary)]/50 p-4 cyber-chamfer-sm relative">
                  <div className="text-[10px] text-[var(--accent-tertiary)] font-share-tech uppercase mb-4">&gt; QUALIFIER_PROTOCOL (2ND_VS_3RD)</div>
                  <div className="flex justify-between items-center px-4">
                    <span className="font-orbitron font-bold text-lg text-[var(--foreground)]">{standings[1]?.name || 'TBD_ENTITY'}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] font-share-tech">VS</span>
                    <span className="font-orbitron font-bold text-lg text-[var(--foreground)]">{standings[2]?.name || 'TBD_ENTITY'}</span>
                  </div>
                </div>
                <div className="bg-[var(--card)] border border-[var(--accent)] p-4 cyber-chamfer-sm shadow-neon-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[var(--accent)]/20 font-orbitron text-4xl font-black">WIN</div>
                  <div className="text-[10px] text-[var(--accent)] font-share-tech uppercase mb-4 relative z-10">&gt; APEX_FINAL_EXECUTION</div>
                  <div className="flex justify-between items-center px-4 relative z-10">
                    <span className="font-orbitron font-bold text-xl text-[var(--foreground)] drop-shadow-neon">{standings[0]?.name || 'TBD_ENTITY'}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] font-share-tech">VS</span>
                    <span className="font-orbitron font-bold text-lg text-[var(--foreground)] opacity-70">QUALIFIER_WINNER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ STANDINGS ══════════════════ */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <div className="bg-[var(--card)] border border-[var(--border)] cyber-chamfer relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-tertiary)] opacity-50"></div>
              
              <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/20">
                <h3 className="font-orbitron text-xl font-bold text-[var(--accent-tertiary)] uppercase tracking-widest drop-shadow-neon text-glitch">GLOBAL_RANKING_TABLE</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap font-mono">
                  <thead className="border-b border-[var(--border)] text-[var(--muted-foreground)] text-[10px] uppercase tracking-widest bg-[var(--background)]">
                    <tr>
                      <th className="px-6 py-4 font-normal">POS</th>
                      <th className="px-6 py-4 font-normal">ENTITY_ID</th>
                      <th className="px-6 py-4 font-normal text-center">WIN</th>
                      <th className="px-6 py-4 font-normal text-center">LOSS</th>
                      <th className="px-6 py-4 font-normal text-center text-[var(--accent-secondary)]">NRR</th>
                      <th className="px-6 py-4 font-normal text-right text-[var(--accent)]">PWR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {standings.map((team: any, idx) => (
                      <tr key={team.name} className="hover:bg-[var(--muted)]/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`text-xs ${idx === 0 ? 'text-[var(--accent)] font-bold drop-shadow-neon' : 'text-[var(--muted-foreground)]'}`}>
                            0{idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 relative">
                          <div className="flex flex-col">
                            <span className="font-orbitron font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--accent-tertiary)] transition-colors">{team.name}</span>
                            <span className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-widest mt-1">{team.full}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-[var(--foreground)]">{team.w}</td>
                        <td className="px-6 py-4 text-center text-[var(--muted-foreground)]">{team.l}</td>
                        <td className="px-6 py-4 text-center text-[var(--foreground)] opacity-80">{team.nrr > 0 ? `+${team.nrr}` : team.nrr}</td>
                        <td className="px-6 py-4 text-right font-bold text-xl text-[var(--accent)] drop-shadow-neon">{team.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border)] border-dashed">
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center">
                <span className="w-1 h-4 bg-[var(--destructive)] mr-2"></span> SYSTEM_ANOMALIES
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--card)] border border-[var(--accent)]/50 p-5 cyber-chamfer-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent)]/10 blur-xl rounded-full"></div>
                  <div className="text-[10px] text-[var(--accent)] font-share-tech uppercase tracking-widest mb-1">GOD_MODE_ACTIVE // ON_FIRE</div>
                  <div className="font-orbitron text-2xl font-black text-[var(--foreground)] drop-shadow-neon mt-2">
                    {onFire ? onFire.name : (standings[0]?.name || 'NONE')}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] font-mono mt-1">
                    {onFire ? '3+ WINSTREAK DETECTED' : 'TOP OF TABLE'}
                  </div>
                </div>

                <div className="bg-[var(--card)] border border-[var(--destructive)]/50 p-5 cyber-chamfer-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--destructive)]/10 blur-xl rounded-full"></div>
                  <div className="text-[10px] text-[var(--destructive)] font-share-tech uppercase tracking-widest mb-1 text-glitch">CRITICAL_FAILURE // BOTTLERS</div>
                  <div className="font-orbitron text-2xl font-black text-[var(--destructive)] mt-2">
                    {bottler ? bottler.name : (standings[standings.length - 1]?.name || 'NONE')}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] font-mono mt-1">
                    {bottler ? '2+ LOSSES RECORDED' : 'BOTTOM OF TABLE'}
                  </div>
                </div>

                <div className="bg-[var(--card)] border border-[var(--accent-secondary)]/50 p-5 cyber-chamfer-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent-secondary)]/10 blur-xl rounded-full"></div>
                  <div className="text-[10px] text-[var(--accent-secondary)] font-share-tech uppercase tracking-widest mb-1">MAX_THROUGHPUT // HIGHEST SCORE</div>
                  <div className="font-orbitron text-2xl font-black text-[var(--accent-secondary)] drop-shadow-neon-secondary mt-2">
                    {highestScore ? `${highestScore.score}` : '000'}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] font-mono mt-1">
                    {highestScore ? `ACHIEVED BY ${highestScore.team}` : 'AWAITING DATA'}
                  </div>
                </div>

                <div className="bg-[var(--card)] border border-[#ff7700]/50 p-5 cyber-chamfer-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#ff7700]/10 blur-xl rounded-full"></div>
                  <div className="text-[10px] text-[#ff7700] font-share-tech uppercase tracking-widest mb-1">MARGIN_ANOMALY // CRUSHING DEFEAT</div>
                  <div className="font-orbitron text-2xl font-black text-[#ff7700] mt-2">
                    {biggestDestruction ? `+${biggestDestruction.diff} RUNS` : '0 RUNS'}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] font-mono mt-1">
                    {biggestDestruction ? `${biggestDestruction.winner} DESTROYED ${biggestDestruction.loser}` : 'AWAITING DATA'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ PROFILE ══════════════════ */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="bg-[var(--card)] border border-[var(--border)] p-8 cyber-chamfer relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-32 bg-[var(--accent-secondary)]/5 flex items-center justify-center opacity-20 pointer-events-none">
                <span className="font-orbitron text-8xl font-black text-transparent [-webkit-text-stroke:1px_var(--accent-secondary)] transform rotate-90">USR</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-orbitron text-3xl font-black text-[var(--foreground)] uppercase tracking-widest mb-2">Captain {myTeam?.owner || 'Unknown'}</h2>
                    <p className="text-xs text-[var(--accent-secondary)] uppercase tracking-[0.3em] font-share-tech border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/10 px-3 py-1 inline-block cyber-chamfer-sm">ID: {myTeam?.name}_OWNER_001</p>
                  </div>
                  <button onClick={() => { localStorage.removeItem('cm_user_id'); setCurrentUser(null); }} className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--destructive)] uppercase tracking-widest font-share-tech transition-colors border border-[var(--border)] px-3 py-1.5 bg-[var(--card)] cyber-chamfer-sm">
                    [SWITCH_ID]
                  </button>
                </div>
                
                <div className="flex gap-12 mt-12 pt-6 border-t border-[var(--border)]/50">
                  <div>
                    <div className="text-sm font-share-tech text-[var(--muted-foreground)] uppercase tracking-widest mb-2">Cycle.Count</div>
                    <div className="font-orbitron text-5xl font-black text-[var(--foreground)] drop-shadow-neon">{matches.length}</div>
                  </div>
                  <div>
                    <div className="text-sm font-share-tech text-[var(--muted-foreground)] uppercase tracking-widest mb-2">Pending.Cycles</div>
                    <div className="font-orbitron text-5xl font-black text-[var(--accent-secondary)] drop-shadow-neon">{Math.max(0, 20 - matches.length)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-share-tech text-sm text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center">
                <span className="w-1 h-4 bg-[var(--accent-tertiary)] mr-2"></span> SYS.ENTITIES
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FALLBACK_TEAMS.map(t => (
                  <div key={t.id} className="bg-[var(--background)] border border-[var(--border)] p-5 cyber-chamfer-sm relative hover:border-[var(--accent-tertiary)]/50 transition-colors group">
                    <TeamBadge name={t.name} />
                    <div className="pl-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-orbitron font-bold text-xl text-[var(--foreground)] group-hover:text-[var(--accent-tertiary)] transition-colors">{t.name}</div>
                        <div className="text-[10px] text-[var(--muted-foreground)] border border-[var(--border)] px-2 py-0.5 bg-[var(--card)] uppercase tracking-widest">OWNER: {t.owner}</div>
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-share-tech">{t.full}</div>
                      <div className="text-[9px] text-[var(--muted-foreground)]/50 uppercase tracking-widest mt-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--muted-foreground)] inline-block"></span> {t.ground}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FAB - Cyberpunk style */}
      <button
        onClick={() => nextFixture ? openScoreModal(nextFixture.team1, nextFixture.team2) : openScoreModal()}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-[var(--accent)] text-black border border-[var(--accent)] flex items-center justify-center z-40 hover:bg-[var(--accent)]/80 transition-all shadow-neon cyber-chamfer cyber-glitch"
      >
        <span className="font-orbitron font-bold text-2xl leading-none">+</span>
      </button>

      {isAddingScore && (
        <ScoreModal
          teams={teams}
          defaultTeam1={prefillTeams?.t1}
          defaultTeam2={prefillTeams?.t2}
          onClose={() => { setIsAddingScore(false); setPrefillTeams(null); }}
          onSubmit={addMatch}
        />
      )}
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

  const inputClasses = "w-full bg-[var(--input)] border border-[var(--border)] py-4 px-4 text-[var(--accent)] font-mono text-lg outline-none focus:border-[var(--accent)] focus:shadow-neon transition-all cyber-chamfer-sm pl-8 relative";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      {/* Scanline overlay specific to modal */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }}></div>
      
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--accent)] cyber-chamfer shadow-neon relative z-10 overflow-hidden">
        <div className="bg-[var(--accent)] px-4 py-2 flex justify-between items-center text-black font-share-tech uppercase font-bold tracking-widest text-xs">
          <span>&gt; UPLOAD_DATA_PACKET.EXE</span>
          <button onClick={onClose} className="hover:text-white transition-colors">[X]</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-[10px] text-[var(--accent)] font-share-tech uppercase tracking-[0.2em] mb-2">TARGET_1 // BATTING</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-bold">&gt;</span>
                <select value={team1} onChange={e => setTeam1(e.target.value)} className={`${inputClasses} appearance-none`} required>
                  <option value="" className="text-[var(--muted-foreground)]">SELECT_ENTITY</option>
                  {teams.filter(t => t.name !== team2).map(t => <option key={t.id} value={t.name}>{t.name} - {t.full}</option>)}
                </select>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-bold">&gt;</span>
                <input type="number" placeholder="RUNS_SCORED" value={score1} onChange={e => setScore1(e.target.value)} className={inputClasses} required inputMode="numeric" />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border)] relative my-8">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--card)] px-4 text-[10px] text-[var(--muted-foreground)] font-share-tech tracking-[0.2em]">VS</div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-[10px] text-[var(--accent-secondary)] font-share-tech uppercase tracking-[0.2em] mb-2">TARGET_2 // CHASING</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-bold">&gt;</span>
                <select value={team2} onChange={e => setTeam2(e.target.value)} className={`${inputClasses} appearance-none focus:border-[var(--accent-secondary)] focus:shadow-neon-secondary text-[var(--accent-secondary)]`} required>
                  <option value="" className="text-[var(--muted-foreground)]">SELECT_ENTITY</option>
                  {teams.filter(t => t.name !== team1).map(t => <option key={t.id} value={t.name}>{t.name} - {t.full}</option>)}
                </select>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-bold">&gt;</span>
                <input type="number" placeholder="RUNS_SCORED" value={score2} onChange={e => setScore2(e.target.value)} className={`${inputClasses} focus:border-[var(--accent-secondary)] focus:shadow-neon-secondary text-[var(--accent-secondary)]`} required inputMode="numeric" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !team1 || !team2 || !score1 || !score2 || team1 === team2}
              className="w-full py-4 bg-[var(--accent)] text-black font-orbitron font-bold text-lg uppercase tracking-widest hover:bg-[var(--accent)]/90 active:bg-[var(--accent)]/80 transition-all disabled:opacity-30 disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] cyber-chamfer-sm cyber-glitch"
            >
              {submitting ? 'PROCESSING...' : 'EXECUTE_INJECTION'}
            </button>
            <p className="text-[9px] text-center text-[var(--muted-foreground)] font-share-tech uppercase tracking-[0.2em] mt-4">
              Warning: Database override is permanent
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Login Screen ───────────────────────────────────────────────────────── */
function LoginScreen({ teams, onSelect }: { teams: any[], onSelect: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-[var(--background)] bg-circuit flex items-center justify-center p-6 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }}></div>
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--accent)] p-8 cyber-chamfer shadow-neon relative z-10">
        <div className="text-[10px] text-[var(--accent)] font-share-tech uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent)] animate-pulse"></span>
          IDENTIFICATION_REQUIRED
        </div>
        <h1 className="font-orbitron text-2xl font-black text-[var(--foreground)] uppercase tracking-widest mb-8">Select Entity</h1>
        
        <div className="space-y-4">
          {teams.map(t => (
            <button 
              key={t.id}
              onClick={() => onSelect(t.name)}
              className="w-full text-left bg-[var(--background)] border border-[var(--border)] p-4 cyber-chamfer-sm hover:border-[var(--accent)] hover:shadow-neon transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: t.color }}></div>
              <div className="pl-4 flex justify-between items-center">
                <div>
                  <div className="font-orbitron font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{t.owner}</div>
                  <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mt-1">{t.name} // {t.full}</div>
                </div>
                <div className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity font-bold">&gt;</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
