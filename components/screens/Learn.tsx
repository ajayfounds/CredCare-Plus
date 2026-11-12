'use client';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import './learn.css';
import { Screen } from '@/components/Screen';
import { Chevron } from '@/components/ui/Toast';
import { factors, guides } from '@/lib/data';
import { haptic } from '@/lib/motion';

export type LearnState = 'default' | 'loading' | 'empty';

const IC: Record<string, string> = {
  Debt: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20M6 15h4',
  Strategy: 'M3 20h18M6 16V9M11 16V5M16 16v-4M20 16v-7',
  Disputes: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15l2 2 4-4',
  Basics: 'M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z',
};
const FACTOR_FILL = ['var(--b800)', 'var(--b700)', 'var(--b600)', 'var(--b500)'];
/** The list order in the frame: newest first, featured guide last. */
const ORDER = ['minimum-payments', 'snowball-vs-avalanche', 'disputing-errors', 'how-credit-scores-work', 'utilisation'];
const all = ORDER.map((s) => guides.find((g) => g.slug === s)!);
const featured = guides.find((g) => g.featured)!;
const CATS = ['All', ...Array.from(new Set(['Basics', ...guides.map((g) => g.cat)]))];

const Search = ({ size = 20 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>);

export function Learn({ state = 'default' }: { state?: LearnState }) {
  const [q, setQ] = useState(state === 'empty' ? 'mortgage' : '');
  const [cat, setCat] = useState('All');
  const [fsel, setFsel] = useState(-1);
  const loading = state === 'loading';
  const qq = q.trim().toLowerCase();
  const searching = qq.length > 0;
  const list = all
    .filter((g) => (searching ? `${g.title} ${g.cat}`.toLowerCase().includes(qq) : cat === 'All' || g.cat === cat))
    .filter((g) => searching || !g.featured);
  const factorLabel = factors.map((f) => `${f.label === 'Age and mix' ? 'age' : f.label.toLowerCase()} ${f.weight}%`).join(', ');

  return (
    <Screen name="V9Learn" scope="learn" tab={3} className="z4bb9c3">
      <div className="z5001c5 in">
        <h1 className="t-title1">Learn</h1>
        <label className="srch">
          <Search />
          <input type="search" aria-label="Search guides" placeholder="Search topics and guides" value={q} onChange={(e) => setQ(e.target.value)} />
          {searching ? (
            <button className="clr" type="button" aria-label="Clear search" onClick={() => setQ('')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          ) : null}
        </label>
      </div>
      {loading ? (
        <div className="z2f0b1c" aria-busy="true" aria-label="Loading guides">
          <div className="z162c0b card"><div className="zd71829 sk" /><div className="z32902e sk" /><div className="z4d6783 sk" /><div className="z4386b9 sk" /></div>
          <div className="ln-sk-row"><div className="zc92e5d sk" /><div className="z82bf23 sk" /><div className="z5de059 sk" /></div>
          <div className="z35e1b3 card" />
        </div>
      ) : null}
      {!loading && !searching ? (
        <>
          <section className="z34c3a6 in" aria-label="Featured">
            <h2 className="zfa3e1c t-title2">Featured</h2>
            <div className="zcd4fcb card hero">
              <Link className="z96ce7e tap" href={`/learn/${featured.slug}`}>
                <p className="t-footnote c3">{featured.cat} · {featured.mins} min read</p>
                <p className="za18ac8 t-title2">{featured.title}</p>
                <p className="za18ac8 t-subhead">The four things CIBIL weighs, and how much each counts</p>
              </Link>
              <div className="z3ae1f6 fbar" data-sel={fsel} role="img" aria-label={factorLabel.charAt(0).toUpperCase() + factorLabel.slice(1)}>
                {factors.map((f, i) => <i key={f.key} style={{ width: `${f.weight}%`, background: FACTOR_FILL[i], animationDelay: i ? `${i * 60}ms` : undefined }} />)}
              </div>
              <div className="fleg" role="group" aria-label="Score factors">
                {factors.map((f, i) => (
                  <button key={f.key} type="button" aria-pressed={fsel === i} onClick={() => { haptic('selection'); setFsel(fsel === i ? -1 : i); }}>
                    <i style={{ background: FACTOR_FILL[i] }} />{f.label} {f.weight}%
                  </button>
                ))}
              </div>
              <p className="z941556 t-footnote c2" aria-live="polite">{fsel < 0 ? 'Tap a factor to see what it means' : factors[fsel].note}</p>
            </div>
          </section>
          <div className="z17a755 chips in" role="group" aria-label="Filter guides">
            {CATS.map((c) => <button key={c} className="chip" type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        </>
      ) : null}
      {!loading ? (
        <section className="z8d0cab in" aria-label={searching ? 'Results' : 'Latest guides'}>
          <div className="ln-head">
            <h2 className="t-title2">{searching ? 'Results' : 'Latest guides'}</h2>
            <span className="t-footnote c3" aria-live="polite">{list.length} {list.length === 1 ? 'guide' : 'guides'}</span>
          </div>
          {list.length ? (
            <div className="z2959c3 card">
              {list.map((g) => (
                <Fragment key={g.slug}>
                  <Link className="zf05798 row" href={`/learn/${g.slug}`}>
                    <span className="thumb" data-c={g.cat}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={IC[g.cat]} /></svg></span>
                    <span className="ln-main">
                      <span className="ln-meta"><span className="t-caption c3">{g.cat}</span><span className="t-caption">{g.mins} min</span></span>
                      <b className="z4738a1 t-headline">{g.title}</b>
                    </span>
                    <span className="chev"><Chevron stroke="currentColor" /></span>
                  </Link>
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="zaf50c9 card" role="status">
              <span className="ln-empty-ic"><Search size={24} /></span>
              <p className="z002535 t-headline">No guides match “{q}”</p>
              <p className="zf45ce8 t-subhead">Try a broader word like score, debt or dispute</p>
              <button className="z3bf6ef btn bs" type="button" onClick={() => setQ('')}>Clear search</button>
            </div>
          )}
        </section>
      ) : null}
    </Screen>
  );
}
