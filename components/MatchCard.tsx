'use client';

import SealScore from './SealScore';
import type { Opportunity } from '@/lib/types';

export default function MatchCard({
  opportunity,
  score,
  reasoning,
  isSaved,
  onToggleSave,
  onGenerateLetter,
  highlight = false,
}: {
  opportunity: Opportunity;
  score: number;
  reasoning: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onGenerateLetter: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 transition-colors ${
        highlight
          ? 'border-gold-500/50 bg-navy-800/80'
          : 'border-navy-600 bg-navy-800/40 hover:border-navy-600/80'
      }`}
    >
      <div className="flex gap-4">
        <SealScore score={score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gold-500">
                {opportunity.type}
              </span>
              <h3 className="font-display text-lg font-semibold text-parchment leading-snug mt-0.5">
                {opportunity.title}
              </h3>
              <p className="text-sm text-slate-400">{opportunity.org}</p>
            </div>
            <button
              onClick={onToggleSave}
              aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
              className="flex-shrink-0 text-xl leading-none"
              title={isSaved ? 'Saved' : 'Save'}
            >
              <span className={isSaved ? 'text-gold-500' : 'text-slate-500 hover:text-slate-300'}>
                {isSaved ? '★' : '☆'}
              </span>
            </button>
          </div>

          <p className="text-sm text-parchment/80 mt-3 leading-relaxed">{reasoning}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 font-mono">
            <span>{opportunity.location}</span>
            <span>·</span>
            <span>Deadline: {opportunity.deadlineMonth}</span>
            <span>·</span>
            <span>{opportunity.amount}</span>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onGenerateLetter}
              className="text-sm font-medium text-gold-500 hover:text-gold-400 transition-colors"
            >
              Draft motivation letter →
            </button>
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              View source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
