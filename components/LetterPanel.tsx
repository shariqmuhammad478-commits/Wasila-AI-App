'use client';

import { useState } from 'react';

export default function LetterPanel({
  opportunityTitle,
  paragraph,
  loading,
  onRegenerate,
  onClose,
}: {
  opportunityTitle: string;
  paragraph: string;
  loading: boolean;
  onRegenerate: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(paragraph).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-800 border border-gold-500/30 rounded-lg max-w-xl w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-gold-500">
            Draft paragraph
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-300 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <h3 className="font-display text-xl font-semibold text-parchment mb-4">
          {opportunityTitle}
        </h3>

        {loading ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            Drafting a paragraph tailored to your profile…
          </div>
        ) : (
          <p className="text-parchment/90 leading-relaxed whitespace-pre-wrap">{paragraph}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCopy}
            disabled={loading}
            className="flex-1 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-semibold rounded-md py-2.5 text-sm transition-colors"
          >
            {copied ? 'Copied ✓' : 'Copy paragraph'}
          </button>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex-1 border border-navy-600 hover:border-slate-400 disabled:opacity-50 text-parchment rounded-md py-2.5 text-sm transition-colors"
          >
            Regenerate
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Always review before submitting — treat this as a first draft in your own voice, not a final letter.
        </p>
      </div>
    </div>
  );
}
