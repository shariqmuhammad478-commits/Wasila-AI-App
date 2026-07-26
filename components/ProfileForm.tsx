'use client';

import { useState } from 'react';
import type { StudentProfile } from '@/lib/types';

const FIELDS = [
  'Computer Science',
  'Software Engineering',
  'Business',
  'Engineering',
  'Natural Sciences',
  'Social Sciences',
  'Public Health',
  'Design',
  'Development Studies',
  'Any Field',
];

const DEGREE_LEVELS = ['Undergraduate', 'Masters', 'PhD'];

export default function ProfileForm({
  onSubmit,
  loading,
}: {
  onSubmit: (profile: StudentProfile) => void;
  loading: boolean;
}) {
  const [cgpa, setCgpa] = useState('3.2');
  const [degreeLevel, setDegreeLevel] = useState('Undergraduate');
  const [field, setField] = useState('Computer Science');
  const [interests, setInterests] = useState('');
  const [locationPref, setLocationPref] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      cgpa: parseFloat(cgpa),
      degreeLevel,
      field,
      interests: interests.trim(),
      locationPref: locationPref.trim() || 'No preference',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            CGPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            required
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="w-full bg-navy-800 border border-navy-600 rounded-md px-3 py-2.5 text-parchment font-mono focus:border-gold-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Degree level
          </label>
          <select
            value={degreeLevel}
            onChange={(e) => setDegreeLevel(e.target.value)}
            className="w-full bg-navy-800 border border-navy-600 rounded-md px-3 py-2.5 text-parchment focus:border-gold-500 outline-none transition-colors"
          >
            {DEGREE_LEVELS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
          Field of study
        </label>
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full bg-navy-800 border border-navy-600 rounded-md px-3 py-2.5 text-parchment focus:border-gold-500 outline-none transition-colors"
        >
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
          Interests &amp; goals
        </label>
        <textarea
          required
          rows={4}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. I want to build machine learning tools for healthcare access in rural Pakistan, and I've been teaching myself Python through open courseware."
          className="w-full bg-navy-800 border border-navy-600 rounded-md px-3 py-2.5 text-parchment placeholder:text-slate-500 focus:border-gold-500 outline-none transition-colors resize-none"
        />
        <p className="text-xs text-slate-500 mt-1.5">
          Be specific — this is what the AI uses to write your motivation letter.
        </p>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
          Location preference (optional)
        </label>
        <input
          type="text"
          value={locationPref}
          onChange={(e) => setLocationPref(e.target.value)}
          placeholder="e.g. stay in Pakistan, or open to studying abroad"
          className="w-full bg-navy-800 border border-navy-600 rounded-md px-3 py-2.5 text-parchment placeholder:text-slate-500 focus:border-gold-500 outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-semibold rounded-md py-3 transition-colors font-display text-lg"
      >
        {loading ? 'Finding your matches…' : 'Find my matches'}
      </button>
    </form>
  );
}
