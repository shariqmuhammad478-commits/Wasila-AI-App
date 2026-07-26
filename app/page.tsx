'use client';

import { useState, useMemo } from 'react';
import ProfileForm from '@/components/ProfileForm';
import MatchCard from '@/components/MatchCard';
import BrowseCard from '@/components/BrowseCard';
import LetterPanel from '@/components/LetterPanel';
import { useSaved } from '@/lib/useSaved';
import opportunitiesData from '@/data/opportunities.json';
import type { StudentProfile, Opportunity, MatchResult } from '@/lib/types';

const opportunities = opportunitiesData as Opportunity[];

type Tab = 'match' | 'browse' | 'saved';

export default function Home() {
  const [tab, setTab] = useState<Tab>('match');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const [letterOpp, setLetterOpp] = useState<Opportunity | null>(null);
  const [letterText, setLetterText] = useState('');
  const [letterLoading, setLetterLoading] = useState(false);

  const { saved, toggle, isSaved } = useSaved();

  const oppById = useMemo(() => {
    const map = new Map<string, Opportunity>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, []);

  async function handleMatch(p: StudentProfile) {
    setProfile(p);
    setMatchLoading(true);
    setMatchError(null);
    setMatches(null);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Matching failed.');
      setMatches(data.matches);
    } catch (err: any) {
      setMatchError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setMatchLoading(false);
    }
  }

  async function handleGenerateLetter(opp: Opportunity) {
    if (!profile) return;
    setLetterOpp(opp);
    setLetterText('');
    setLetterLoading(true);
    try {
      const res = await fetch('/api/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, opportunityId: opp.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not draft letter.');
      setLetterText(data.paragraph);
    } catch (err: any) {
      setLetterText('Something went wrong drafting this letter. Please try regenerating.');
    } finally {
      setLetterLoading(false);
    }
  }

  const sortedMatches = matches
    ? [...matches].sort((a, b) => b.score - a.score).filter((m) => oppById.has(m.id))
    : null;

  const savedOpportunities = opportunities.filter((o) => saved.includes(o.id));

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-navy-700/60">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-3xl font-semibold text-parchment tracking-tight">
              وسیلہ <span className="text-gold-500">Wasila</span>
            </h1>
          </div>
          <p className="text-slate-400 mt-2 max-w-xl">
            The connection between you and the scholarship or internship that actually fits —
            matched by AI, not by scrolling through fifteen Facebook groups.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-1 border-b border-navy-700/60">
          {(
            [
              ['match', 'Match me'],
              ['browse', 'Browse all'],
              ['saved', `Saved (${saved.length})`],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === key
                  ? 'border-gold-500 text-parchment'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {tab === 'match' && (
          <div className="grid md:grid-cols-[380px_1fr] gap-10">
            <div>
              <h2 className="font-display text-xl font-semibold text-parchment mb-4">
                Your profile
              </h2>
              <ProfileForm onSubmit={handleMatch} loading={matchLoading} />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-parchment mb-4">
                Your matches
              </h2>

              {!matches && !matchLoading && !matchError && (
                <div className="text-slate-500 text-sm border border-dashed border-navy-600 rounded-lg p-8 text-center">
                  Fill in your profile and we&apos;ll rank every opportunity in our database
                  against it — with a plain-language reason for each score.
                </div>
              )}

              {matchLoading && (
                <div className="text-slate-400 text-sm border border-navy-600 rounded-lg p-8 text-center">
                  Reading your profile against {opportunities.length} opportunities…
                </div>
              )}

              {matchError && (
                <div className="text-red-300 text-sm border border-red-900/50 bg-red-950/20 rounded-lg p-4">
                  {matchError}
                </div>
              )}

              {sortedMatches && (
                <div className="space-y-4">
                  {sortedMatches.slice(0, 8).map((m, i) => {
                    const opp = oppById.get(m.id);
                    if (!opp) return null;
                    return (
                      <MatchCard
                        key={m.id}
                        opportunity={opp}
                        score={m.score}
                        reasoning={m.reasoning}
                        isSaved={isSaved(opp.id)}
                        onToggleSave={() => toggle(opp.id)}
                        onGenerateLetter={() => handleGenerateLetter(opp)}
                        highlight={i === 0}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'browse' && (
          <div>
            <h2 className="font-display text-xl font-semibold text-parchment mb-4">
              Full database ({opportunities.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {opportunities.map((o) => (
                <BrowseCard
                  key={o.id}
                  opportunity={o}
                  isSaved={isSaved(o.id)}
                  onToggleSave={() => toggle(o.id)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'saved' && (
          <div>
            <h2 className="font-display text-xl font-semibold text-parchment mb-4">
              Saved opportunities
            </h2>
            {savedOpportunities.length === 0 ? (
              <div className="text-slate-500 text-sm border border-dashed border-navy-600 rounded-lg p-8 text-center">
                Nothing saved yet. Tap the star on any opportunity to keep it here.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedOpportunities.map((o) => (
                  <BrowseCard
                    key={o.id}
                    opportunity={o}
                    isSaved={isSaved(o.id)}
                    onToggleSave={() => toggle(o.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-xs text-slate-600 border-t border-navy-700/60">
        Built for students navigating scattered scholarship and internship listings. Not
        affiliated with HEC, USEFP, or any listed organization — always verify details on the
        official source before applying.
      </footer>

      {letterOpp && (
        <LetterPanel
          opportunityTitle={letterOpp.title}
          paragraph={letterText}
          loading={letterLoading}
          onRegenerate={() => handleGenerateLetter(letterOpp)}
          onClose={() => setLetterOpp(null)}
        />
      )}
    </main>
  );
}
