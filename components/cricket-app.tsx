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
  { id: 'rcb', name: 'RCB', full: 'Royal Challengers Bengaluru', color: '#CC0000', owner: 'Srikant',  ground: 'M. Chinnaswamy Stadium, Bengaluru' },
  { id: 'csk', name: 'CSK', full: 'Chennai Super Kings',         color: '#FFCC00', owner: 'KVD',      ground: 'MA Chidambaram Stadium, Chennai' },
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

const TeamBadge = ({ name }: { name: string }) => {
  const team = FALLBACK_TEAMS.find(t => t.name === name);
  return (
    <div 
      className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white rounded-sm"
      style={{ backgroundColor: team?.color || '#333' }}
    >
      {name.charAt(0)}
    </div>
  );
};

/* ─── Setup screen ───────────────────────────────────────────────────────── */
function SetupScreen() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm border-t-4 border-[#CC0000]">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Required</h1>
        <p className="text-sm text-gray-600 mb-4">
          Add your Supabase credentials to <code className="bg-gray-100 px-1 py-0.5 border border-gray-300 rounded text-xs">.env.local</code>.
        </p>
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
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC0000]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-24 max-w-md mx-auto relative overflow-x-hidden text-gray-900">

      {/* ── ESPN Style Header ── */}
      <div className="bg-[#CC0000] text-white px-4 py-3 shadow-md flex items-center justify-between sticky top-0 z-30">
        <div className="font-black italic text-xl tracking-tighter">MINI IPL</div>
        <button 
          onClick={() => nextFixture ? openScoreModal(nextFixture.team1, nextFixture.team2) : openScoreModal()}
          className="text-xs font-bold uppercase tracking-wider bg-white text-[#CC0000] px-2 py-1 rounded shadow-sm hover:bg-gray-100 active:scale-95 transition-transform"
        >
          + Add Score
        </button>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="bg-white border-b border-gray-300 flex overflow-x-auto sticky top-[52px] z-20 shadow-sm">
        {(['home', 'scores', 'standings', 'profile'] as const).map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border-b-[3px] whitespace-nowrap px-4 transition-colors ${
              activeTab === t ? 'border-[#CC0000] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-4">
        
        {/* ══════════════════ HOME ══════════════════ */}
        {activeTab === 'home' && (
          <>
            {/* Top Headline Section */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800"
                  className="w-full h-full object-cover opacity-80"
                  alt="Cricket pitch"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[#FFCC00] text-xs font-bold uppercase tracking-wider mb-1">Top Story</span>
                  <h2 className="text-white text-2xl font-bold leading-tight">Mini IPL 5-Over League is Underway</h2>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-medium">The season is {matches.length}/20 matches complete. Intense 5-over action continues.</p>
              </div>
              {nextFixture ? (
                <button
                  onClick={() => openScoreModal(nextFixture.team1, nextFixture.team2)}
                  className="w-full p-3 bg-gray-50 text-sm font-bold text-blue-600 text-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  UPCOMING: {nextFixture.team1} vs {nextFixture.team2} - Record Now
                </button>
              ) : (
                <div className="w-full p-3 bg-gray-50 text-sm font-bold text-gray-500 text-center">
                  All Matches Completed
                </div>
              )}
            </div>

            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mt-4 pl-1">Latest Results</h3>
            {matches.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded p-6 text-center text-sm text-gray-500 font-medium">
                No matches played yet.
              </div>
            ) : (
              <div className="space-y-2">
                {matches.slice(0, 5).map(m => (
                  <div key={m.id} className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-gray-100 px-3 py-1.5 text-[10px] text-gray-600 font-bold uppercase border-b border-gray-200 flex justify-between">
                      <span>Final</span>
                      <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <TeamBadge name={m.team1} />
                          <span className={`text-sm ${m.winner === m.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{m.team1}</span>
                          {m.winner === m.team1 && <span className="text-[#CC0000] text-xs">◀</span>}
                        </div>
                        <span className={`text-sm ${m.winner === m.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{m.score1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <TeamBadge name={m.team2} />
                          <span className={`text-sm ${m.winner === m.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{m.team2}</span>
                          {m.winner === m.team2 && <span className="text-[#CC0000] text-xs">◀</span>}
                        </div>
                        <span className={`text-sm ${m.winner === m.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{m.score2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════ SCORES/FIXTURES ══════════════════ */}
        {activeTab === 'scores' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider pl-1">Leg 1</h3>
            <div className="bg-white border border-gray-200 rounded shadow-sm divide-y divide-gray-200">
              {FIXTURE_LIST.filter(f => f.leg === 1).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                return (
                  <div key={fixture.id} className="p-3" onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{result ? 'Final' : 'Scheduled'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <TeamBadge name={fixture.team1} />
                        <span className={`text-sm ${result?.winner === fixture.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                          {fixture.team1} <span className="text-[10px] text-gray-400 font-normal ml-1">Home</span>
                        </span>
                        {result?.winner === fixture.team1 && <span className="text-[#CC0000] text-xs">◀</span>}
                      </div>
                      {result ? (
                        <span className={`text-sm ${result.winner === fixture.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{result.score1}</span>
                      ) : (
                        <span className="text-xs text-blue-600 font-semibold cursor-pointer">Add</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <TeamBadge name={fixture.team2} />
                        <span className={`text-sm ${result?.winner === fixture.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                          {fixture.team2} <span className="text-[10px] text-gray-400 font-normal ml-1">Away</span>
                        </span>
                        {result?.winner === fixture.team2 && <span className="text-[#CC0000] text-xs">◀</span>}
                      </div>
                      {result && (
                        <span className={`text-sm ${result.winner === fixture.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{result.score2}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider pl-1 mt-6">Leg 2</h3>
            <div className="bg-white border border-gray-200 rounded shadow-sm divide-y divide-gray-200">
              {FIXTURE_LIST.filter(f => f.leg === 2).map(fixture => {
                const result = getFixtureResult(fixture, matches);
                return (
                  <div key={fixture.id} className="p-3" onClick={() => !result && openScoreModal(fixture.team1, fixture.team2)}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{result ? 'Final' : 'Scheduled'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <TeamBadge name={fixture.team1} />
                        <span className={`text-sm ${result?.winner === fixture.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                          {fixture.team1} <span className="text-[10px] text-gray-400 font-normal ml-1">Home</span>
                        </span>
                        {result?.winner === fixture.team1 && <span className="text-[#CC0000] text-xs">◀</span>}
                      </div>
                      {result ? (
                        <span className={`text-sm ${result.winner === fixture.team1 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{result.score1}</span>
                      ) : (
                        <span className="text-xs text-blue-600 font-semibold cursor-pointer">Add</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <TeamBadge name={fixture.team2} />
                        <span className={`text-sm ${result?.winner === fixture.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                          {fixture.team2} <span className="text-[10px] text-gray-400 font-normal ml-1">Away</span>
                        </span>
                        {result?.winner === fixture.team2 && <span className="text-[#CC0000] text-xs">◀</span>}
                      </div>
                      {result && (
                        <span className={`text-sm ${result.winner === fixture.team2 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>{result.score2}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════ STANDINGS ══════════════════ */}
        {activeTab === 'standings' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase">League Table</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-white border-b border-gray-200 text-gray-500 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-3 py-2 w-8">#</th>
                      <th className="px-1 py-2">Team</th>
                      <th className="px-3 py-2 text-center">W</th>
                      <th className="px-3 py-2 text-center">L</th>
                      <th className="px-3 py-2 text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {standings.map((team: any, idx) => (
                      <tr key={team.name} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-xs font-semibold text-gray-500">{idx + 1}</td>
                        <td className="px-1 py-3">
                          <div className="flex items-center gap-2">
                            <TeamBadge name={team.name} />
                            <div>
                              <div className="font-bold text-gray-900">{team.name}</div>
                              <div className="text-[9px] text-gray-500 uppercase">{team.full}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-gray-900">{team.w}</td>
                        <td className="px-3 py-3 text-center text-gray-900">{team.l}</td>
                        <td className="px-3 py-3 text-right font-bold text-gray-900">{team.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ PROFILE ══════════════════ */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded shadow-sm p-4 text-center">
              <h2 className="text-lg font-bold text-gray-900">Captain Srikant</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">RCB Owner</p>
              
              <div className="flex justify-around mt-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-black text-gray-900">{matches.length}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Matches Played</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#CC0000]">{Math.max(0, 20 - matches.length)}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Remaining</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase">Team Directory</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {FALLBACK_TEAMS.map(t => (
                  <div key={t.id} className="p-3 flex items-start gap-3">
                    <TeamBadge name={t.name} />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.full}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Owner: <span className="font-semibold text-gray-900">{t.owner}</span></div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{t.ground}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

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

  const sel = "w-full bg-white border border-gray-300 py-3 px-3 rounded text-gray-900 text-sm font-bold outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-colors appearance-none";
  const inp = "w-full bg-white border border-gray-300 py-3 px-3 rounded text-gray-900 text-sm font-bold outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm bg-gray-100 rounded shadow-2xl overflow-hidden">
        <div className="bg-[#CC0000] px-4 py-3 flex justify-between items-center text-white">
          <h2 className="text-sm font-bold uppercase tracking-wider">Record Score</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><span className="text-xl leading-none">&times;</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-white p-4 border border-gray-200 rounded shadow-sm space-y-3">
            <p className="text-xs font-bold text-gray-600 uppercase">Team 1 (Home/Batting)</p>
            <select value={team1} onChange={e => setTeam1(e.target.value)} className={sel} required>
              <option value="" className="text-gray-400">Select team…</option>
              {teams.filter(t => t.name !== team2).map(t => <option key={t.id} value={t.name}>{t.full}</option>)}
            </select>
            <input type="number" placeholder="Total Runs (e.g. 54)" value={score1} onChange={e => setScore1(e.target.value)} className={inp} required inputMode="numeric" />
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded shadow-sm space-y-3">
            <p className="text-xs font-bold text-gray-600 uppercase">Team 2 (Away/Chasing)</p>
            <select value={team2} onChange={e => setTeam2(e.target.value)} className={sel} required>
              <option value="" className="text-gray-400">Select team…</option>
              {teams.filter(t => t.name !== team1).map(t => <option key={t.id} value={t.name}>{t.full}</option>)}
            </select>
            <input type="number" placeholder="Total Runs (e.g. 55)" value={score2} onChange={e => setScore2(e.target.value)} className={inp} required inputMode="numeric" />
          </div>
          <button
            type="submit"
            disabled={submitting || !team1 || !team2 || !score1 || !score2 || team1 === team2}
            className="w-full py-3 bg-[#CC0000] rounded text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Submit Result'}
          </button>
        </form>
      </div>
    </div>
  );
}
