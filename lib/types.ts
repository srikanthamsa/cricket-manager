export type TeamId = 'rcb' | 'csk' | 'mi' | 'kkr' | 'srh';

export interface Team {
  id: TeamId;
  name: string;
  full: string;
  shortName: string;
  color: string;
  emoji: string;
  tagline: string;
  owner?: string;
  ground?: string;
  matches: number;
  wins: number;
  losses: number;
  nrr: number;
  form: ('W' | 'L')[];
}

export type MatchStatus = 'upcoming' | 'completed';

export interface Match {
  id: string;
  team1Id: TeamId;
  team2Id: TeamId;
  team1Runs?: number;
  team1Wickets?: number;
  team2Runs?: number;
  team2Wickets?: number;
  winnerId?: TeamId;
  status: MatchStatus;
  round: number;
  matchNumber: number;
}

export interface StandingsRow extends Team {
  points: number;
  rank: number;
}
