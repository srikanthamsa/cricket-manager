'use client';

import { Team, TeamId, Match, StandingsRow } from './types';

const TEAMS_KEY = 'ipl5_teams';
const MATCHES_KEY = 'ipl5_matches';

export const INITIAL_TEAMS: Record<TeamId, Team> = {
  'thunderbolts': { id: 'thunderbolts', name: 'Thunderbolts', shortName: 'TBT', color: '#f59e0b', emoji: '⚡', matches: 0, wins: 0, losses: 0, nrr: 0, form: [] },
  'neon-kings': { id: 'neon-kings', name: 'Neon Kings', shortName: 'NKG', color: '#6366f1', emoji: '👑', matches: 0, wins: 0, losses: 0, nrr: 0, form: [] },
  'shadow-xi': { id: 'shadow-xi', name: 'Shadow XI', shortName: 'SXI', color: '#64748b', emoji: '🌑', matches: 0, wins: 0, losses: 0, nrr: 0, form: [] },
  'royal-crushers': { id: 'royal-crushers', name: 'Royal Crushers', shortName: 'RCR', color: '#ef4444', emoji: '💥', matches: 0, wins: 0, losses: 0, nrr: 0, form: [] },
  'cosmic-strikers': { id: 'cosmic-strikers', name: 'Cosmic Strikers', shortName: 'CST', color: '#22c55e', emoji: '🌌', matches: 0, wins: 0, losses: 0, nrr: 0, form: [] },
};

function generateFixtures(): Match[] {
  const teamIds = Object.keys(INITIAL_TEAMS) as TeamId[];
  const fixtures: Match[] = [];
  let matchNumber = 1;

  // Double round-robin: each pair plays twice
  for (let round = 1; round <= 2; round++) {
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        fixtures.push({
          id: `match-${matchNumber}`,
          team1Id: round === 1 ? teamIds[i] : teamIds[j],
          team2Id: round === 1 ? teamIds[j] : teamIds[i],
          status: 'upcoming',
          round,
          matchNumber: matchNumber++,
        });
      }
    }
  }
  return fixtures;
}

export function getTeams(): Record<TeamId, Team> {
  if (typeof window === 'undefined') return INITIAL_TEAMS;
  const stored = localStorage.getItem(TEAMS_KEY);
  if (!stored) {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
    return INITIAL_TEAMS;
  }
  return JSON.parse(stored);
}

export function getMatches(): Match[] {
  if (typeof window === 'undefined') return generateFixtures();
  const stored = localStorage.getItem(MATCHES_KEY);
  if (!stored) {
    const fixtures = generateFixtures();
    localStorage.setItem(MATCHES_KEY, JSON.stringify(fixtures));
    return fixtures;
  }
  return JSON.parse(stored);
}

export function submitScore(
  matchId: string,
  team1Runs: number,
  team1Wickets: number,
  team2Runs: number,
  team2Wickets: number
): void {
  const matches = getMatches();
  const teams = getTeams();
  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  const winnerId = team1Runs > team2Runs ? match.team1Id : match.team2Id;
  const loserId = winnerId === match.team1Id ? match.team2Id : match.team1Id;

  // Update match
  const updated: Match = {
    ...match,
    team1Runs,
    team1Wickets,
    team2Runs,
    team2Wickets,
    winnerId,
    status: 'completed',
  };
  const newMatches = matches.map(m => m.id === matchId ? updated : m);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(newMatches));

  // Update team stats
  const winner = teams[winnerId];
  const loser = teams[loserId];

  const winnerNrrDelta = computeNrrDelta(
    winnerId === match.team1Id ? team1Runs : team2Runs,
    winnerId === match.team1Id ? team2Runs : team1Runs
  );

  teams[winnerId] = {
    ...winner,
    matches: winner.matches + 1,
    wins: winner.wins + 1,
    nrr: parseFloat(((winner.nrr * winner.matches + winnerNrrDelta) / (winner.matches + 1)).toFixed(3)),
    form: [...winner.form.slice(-4), 'W'],
  };
  teams[loserId] = {
    ...loser,
    matches: loser.matches + 1,
    losses: loser.losses + 1,
    nrr: parseFloat(((loser.nrr * loser.matches - winnerNrrDelta) / (loser.matches + 1)).toFixed(3)),
    form: [...loser.form.slice(-4), 'L'],
  };

  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

function computeNrrDelta(winnerRuns: number, loserRuns: number): number {
  const winnerRate = winnerRuns / 5;
  const loserRate = loserRuns / 5;
  return parseFloat((winnerRate - loserRate).toFixed(3));
}

export function getStandings(): StandingsRow[] {
  const teams = getTeams();
  return Object.values(teams)
    .map(t => ({ ...t, points: t.wins * 2 }))
    .sort((a, b) => b.points - a.points || b.nrr - a.nrr)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

export function resetData(): void {
  localStorage.removeItem(TEAMS_KEY);
  localStorage.removeItem(MATCHES_KEY);
  window.location.reload();
}
