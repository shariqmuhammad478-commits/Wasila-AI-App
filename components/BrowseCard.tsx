'use client';

import type { Opportunity } from '@/lib/types';

export default function BrowseCard({
  opportunity,
  isSaved,
  onToggleSave,
}: {
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-800/40 hover:border-navy-600/80 p-5 transition-colors">
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
        >
          <span className={isSaved ? 'text-gold-500' : 'text-slate-500 hover:text-slate-300'}>
            {isSaved ? '★' : '☆'}
          </span>
        </button>
      </div>

      <p className="text-sm text-parchment/70 mt-3 leading-relaxed">{opportunity.description}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 font-mono">
        <span>{opportunity.location}</span>
        <span>·</span>
        <span>Min CGPA {opportunity.minCgpa}</span>
        <span>·</span>
        <span>Deadline: {opportunity.deadlineMonth}</span>
      </div>

      <a
        href={opportunity.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-sm font-medium text-gold-500 hover:text-gold-400 transition-colors"
      >
        View source ↗
      </a>
    </div>
  );
}
