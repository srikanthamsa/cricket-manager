import { Team } from '@/lib/types';

interface Props {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizes = {
  sm: 'w-9 h-9 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-3xl',
};

export default function TeamBadge({ team, size = 'md', showName = false }: Props) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${sizes[size]} rounded-2xl flex items-center justify-center flex-shrink-0`}
        style={{ background: `${team.color}18`, border: `1.5px solid ${team.color}33` }}
      >
        <span>{team.emoji}</span>
      </div>
      {showName && (
        <span className="text-[10px] font-bold text-[#888] text-center leading-tight max-w-[56px] uppercase tracking-wide">
          {team.shortName}
        </span>
      )}
    </div>
  );
}
