'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import './article.css';
import { Screen } from '@/components/Screen';
import { BackIcon } from '@/components/screens/Analysis';
import { causes, factors, guides, payoff } from '@/lib/data';
import { inr } from '@/lib/format';
import { card } from '@/lib/model';
import { haptic } from '@/lib/motion';

const ROOT: Record<string, string> = {
  'how-credit-scores-work': 'z1d52c8', 'minimum-payments': 'zcfc20d', 'snowball-vs-avalanche': 'z1db334',
  'disputing-errors': 'zb75194', utilisation: 'z77e4b0',
};
const NAME: Record<string, string> = {
  'how-credit-scores-work': 'V9ArticleScore', 'minimum-payments': 'V9ArticleMin', 'snowball-vs-avalanche': 'V9ArticleStrategy',
  'disputing-errors': 'V9ArticleDisputes', utilisation: 'V9ArticleUtilisation',
};
const ARTICLE_RATE = 36; // % a year: 3 % a month, the article's stated assumption
const PRINCIPAL = 100000;
const util = causes.find((c) => c.utilisation)!.utilisation!;
const targetAmt = (util.target / 100) * card.limit;
const lakh = (n: number) => `₹${(n / 100000).toFixed(2)} lakh`;

const Tip = ({ children, className = 'z062d4a' }: { children: ReactNode; className?: string }) => (
  <div className={`${className} tip`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6M10 22h4" />
    </svg>
    <p>{children}</p>
  </div>
);
const Head = ({ slug }: { slug: string }) => {
  const g = guides.find((x) => x.slug === slug)!;
  return (
    <header className="z3ae1f6 in">
      <p className="t-footnote c3">{g.cat} · {g.mins} min read</p>
      <h1 className="zd43169 t-title1">{g.title}</h1>
    </header>
  );
};
const FACTOR_FILL = ['var(--b800)', 'var(--b700)', 'var(--b600)', 'var(--b500)'];
const FACTOR_DOT = ['var(--b700)', 'var(--b600)', 'var(--b500)', 'var(--b200)'];
const FACTOR_LONG = ['Payment history.', 'Credit utilisation.', 'Credit age and mix.', 'Enquiries.'];
const FACTOR_MORE = [' One missed payment can pull your score down sharply.', '', '', ' Space them out.'];
const factorText = (i: number, note: string) => ` ${i === 2 ? note.replace('mix of loans', 'mix of secured and unsecured loans') : note}.${FACTOR_MORE[i]}`;

function ScoreBody() {
  return (
    <>
      <Head slug="how-credit-scores-work" />
      <p className="z387569 in t-reading">Your credit score isn&apos;t a random number a bank gives you. It&apos;s a calculated read on <b>how risky it is to lend you money</b>.</p>
      <h2 className="z05801e in t-title2">The four factors</h2>
      <div className="zf03f7e in">
        <div className="fbar" role="img" aria-label={factors.map((f, i) => `${i ? f.label.toLowerCase() : f.label} ${f.weight}%`).join(', ')}>
          {factors.map((f, i) => <i key={f.key} style={{ width: `${f.weight}%`, background: FACTOR_FILL[i], animationDelay: i ? `${i * 60}ms` : undefined }} />)}
        </div>
      </div>
      <div className="z4536c3 in">
        <div className="lg">
          {factors.map((f, i) => (
            <div key={f.key} className="lr s1">
              <span className="mk"><i className="ar-dot" style={{ background: FACTOR_DOT[i] }} /></span>
              <div><p className="tt">{f.label}</p></div>
              <span className="am">{f.weight}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="zb19bd5 in">
        {factors.map((f, i) => <div key={f.key} className="fd"><b>{FACTOR_LONG[i]}</b>{factorText(i, f.note)}</div>)}
      </div>
      <p className="z04a7f3 t-footnote">CIBIL doesn&apos;t publish exact weights. These are widely cited estimates.</p>
      <Tip>Checking your own score is a soft enquiry. It never lowers your score.</Tip>
      <p className="z062d4a t-reading">Knowing the weights tells you where to start: payments first, then utilisation.</p>
    </>
  );
}

function MinBody() {
  const [x, setX] = useState(0);
  const now = payoff(x);
  const base = payoff(0);
  const with500 = payoff(500);
  const years = now.years >= 10 ? Math.round(now.years) : now.years.toFixed(1);
  const interest = now.interest >= 100000 ? lakh(now.interest) : inr(Math.round(now.interest / 1000) * 1000);
  const label = x ? `+${inr(x)}` : 'None';
  return (
    <>
      <header className="z022793 card in">
        <div>
          <p className="z26630a t-footnote">Time to clear {inr(PRINCIPAL)}</p>
          <p className="zf005b8 fig-xl" aria-live="polite">~{years} <span className="z26630a t-headline">years</span></p>
        </div>
        <div className="zf6ef39 trk" role="img" aria-label={`About ${now.years.toFixed(1)} years to clear`}>
          <i style={{ width: `${Math.round((now.years / base.years) * 100)}%`, background: 'var(--wn600)', transition: 'width var(--d-base) var(--ease-io)' }} />
        </div>
        <div className="z7604c4 t-caption"><span>{'Interest ≈ '}<b className="mono">{interest}</b></span><span>at {ARTICLE_RATE}% a year</span></div>
        <label className="zb17065 t-subhead-m" htmlFor="amx"><span>Extra each month</span><span className="mono-m">{label}</span></label>
        <input id="amx" className="rng" type="range" min="0" max="2000" step="100" value={x}
          onChange={(e) => { haptic('selection'); setX(+e.target.value); }}
          style={{ '--p': `${x / 20}%` } as CSSProperties} aria-valuetext={`${label} extra a month`} />
        <div className="z38d71a t-caption c2"><span>{inr(0)}</span><span>{inr(2000)}</span></div>
      </header>
      <p className="z34c3a6 t-footnote c3 in">Debt · 3 min read</p>
      <h1 className="za56e29 t-title1 in">The truth about minimum payments</h1>
      <p className="zf03f7e in t-reading">Banks are happy when you pay only the minimum due. That&apos;s how they earn the most interest from you.</p>
      <h2 className="z031404 in t-title2">The maths trap</h2>
      <p className="z9186d0 in t-reading">
        {'Say you owe '}<b>{inr(PRINCIPAL)}</b>{` at ${ARTICLE_RATE}% a year and pay only the minimum, usually 5%. Clearing it would take about `}
        <b>{Math.round(base.years)} years</b>{", and you'd pay around "}<b>{lakh(base.interest)}</b>
        {" in interest. That's more than you borrowed."}
      </p>
      <p className="za860ba in t-reading">
        {'Paying just '}<b>{inr(500)} more</b>{` each month cuts that to about ${Math.round(with500.years)} years and saves you roughly ${inr(Math.round((base.interest - with500.interest) / 10000) * 10000)}.`}
      </p>
      <p className="zd43169 t-footnote">Assumes 3% monthly interest, a 5% minimum with a {inr(200)} floor, and no new spending.</p>
      <Tip>Easy win: set auto-pay a little above the minimum. You won&apos;t have to think about it again.</Tip>
    </>
  );
}

function StrategyBody() {
  return (
    <>
      <Head slug="snowball-vs-avalanche" />
      <p className="z387569 in t-reading">Two proven ways to clear several debts. One saves you the most money. The other keeps you going.</p>
      <div className="z3d1bd5 in">
        <div className="z9b624a card"><p className="t-footnote c3">Avalanche</p><p className="za18ac8 t-headline">Highest interest first</p><p className="za18ac8 t-footnote">Saves the most interest over time</p></div>
        <div className="z9b624a card"><p className="t-footnote c3">Snowball</p><p className="za18ac8 t-headline">Smallest balance first</p><p className="za18ac8 t-footnote">Clears whole debts sooner, so you see wins early</p></div>
      </div>
      <h2 className="z4b015f t-title2">How each works</h2>
      <p className="zd43169 t-reading"><b>Avalanche:</b>{" put every spare rupee on the debt with the highest interest rate. When it's gone, move to the next highest."}</p>
      <p className="z002535 t-reading"><b>Snowball:</b>{' put every spare rupee on the smallest balance. Each debt you close frees up its payment for the next one.'}</p>
      <p className="z002535 t-reading">{'Whichever you pick, '}<b>keep paying the minimum on everything else</b>. Missing a minimum costs more than either method saves.</p>
      <div className="z3ae1f6 fd"><b>For you, avalanche points at your {card.bank.split(' ')[0]} card.</b>{` It charges about ${ARTICLE_RATE}% a year, far more than your SBI home loan. Clearing it first saves the most.`}</div>
      <Tip className="z3ae1f6">Pick avalanche if you&apos;ll stick with it. Pick snowball if early wins keep you motivated.</Tip>
    </>
  );
}

function DisputesBody() {
  const STEPS: [string, string][] = [
    ['Find the error.', " Note the lender, account and what's wrong."],
    ['Raise a dispute with the bureau.', ' For CIBIL, do it online from your CIBIL account.'],
    ['The bureau checks with your lender.', " You don't need to chase the bank yourself."],
    ['Track it.', " Keep your dispute ID until it's closed."],
  ];
  return (
    <>
      <Head slug="disputing-errors" />
      <p className="z387569 in t-reading">{"Errors happen: a loan you never took, a payment marked late that wasn't. You have the right to get them fixed, "}<b>free of charge</b>.</p>
      <h2 className="z05801e in t-title2">Four steps</h2>
      <ol className="ze01f12 steps in">{STEPS.map(([b, t]) => <li key={b}><span><b>{b}</b>{t}</span></li>)}</ol>
      <div className="zad35ef card">
        <span className="z033e9e fig-l">30<span className="t-subhead-m">{' days'}</span></span>
        <p className="z91b8d9 t-subhead">{'Lenders and bureaus must resolve your complaint in 30 days. After that, RBI rules entitle you to '}<b>{inr(100)} for every day</b>{' of delay.'}</p>
      </div>
      <Link className="z3ae1f6 btn bp" href="/actions?sheet=dispute">Start a dispute</Link>
    </>
  );
}

function UtilisationBody() {
  return (
    <>
      <Head slug="utilisation" />
      <p className="z387569 in t-reading">{"Utilisation is how much of your credit limit you're using. Lenders read high use as a sign of "}<b>financial stress</b>, even if you pay on time.</p>
      <div className="z33f683 card in">
        <div className="ar-row"><p className="t-headline">Your {card.bank.split(' ')[0]} card</p><p className="fig-l">{card.usedPct}%</p></div>
        <div className="z83da50 trk" role="img" aria-label={`${card.usedPct}% of ${inr(card.limit)} used, target ${util.target}%`}>
          <i style={{ width: `${card.usedPct}%`, background: 'var(--er600)' }} />
          <b className="ar-notch" style={{ left: `${util.target}%` }} />
        </div>
        <div className="zdc8b50 t-footnote"><span>{inr(card.balance)} of {inr(card.limit)}</span><span>Target {util.target}% = {inr(targetAmt)}</span></div>
      </div>
      <h2 className="z4b015f t-title2">Three ways to lower it</h2>
      <div className="ar-list">
        <div className="fd"><b>Pay down the balance.</b>{` Bringing your card to about ${inr(targetAmt)} gets you to ${util.target}%.`}</div>
        <div className="fd"><b>Pay before the statement date.</b>{' Banks usually report the balance on your statement, so paying earlier lowers what the bureau sees.'}</div>
        <div className="fd"><b>Ask for a higher limit.</b>{" The same spend on a bigger limit is a smaller share. Just don't spend more."}</div>
      </div>
      <Tip className="z3ae1f6">Under {util.target}% is good. Under 10% is even better. It counts per card and across all your cards.</Tip>
    </>
  );
}

const BODY: Record<string, () => ReactNode> = {
  'how-credit-scores-work': ScoreBody, 'minimum-payments': MinBody, 'snowball-vs-avalanche': StrategyBody,
  'disputing-errors': DisputesBody, utilisation: UtilisationBody,
};

const Thumb = ({ down }: { down?: boolean }) => (
  <svg className={down ? 'ar-down' : undefined} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 10v12" /><path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.5l-2.3 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z" />
  </svg>
);

export function Article({ slug }: { slug: string }) {
  const g = guides.find((x) => x.slug === slug)!;
  const [saved, setSaved] = useState(false);
  const [vote, setVote] = useState<'y' | 'n' | null>(null);
  const [read, setRead] = useState(false);
  const inCat = guides.filter((x) => x.cat === g.cat).length;
  const Body = BODY[slug];
  return (
    <Screen name={NAME[slug]} scope="article" ent="none" className={ROOT[slug]}>
      <div className="ar-top">
        <Link className="ib" href="/learn" aria-label="Back to Learn"><BackIcon /></Link>
        <div className="ar-tools">
          <button className="ib" type="button" aria-pressed={saved} aria-label="Save guide" onClick={() => setSaved(!saved)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          </button>
          <button className="ib" type="button" aria-label="Share guide" onClick={() => { if (navigator.share) navigator.share({ title: g.title, url: location.href }).catch(() => {}); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v13M7 8l5-5 5 5M5 21h14" /></svg>
          </button>
        </div>
      </div>
      <article className="ar-col">
        <Body />
        <section className="z05d053 card" aria-label="Was this helpful?">
          <p className="t-headline">Was this helpful?</p>
          <div className="ar-votes">
            <button className="vote" type="button" aria-pressed={vote === 'y'} onClick={() => setVote('y')}><Thumb />Yes</button>
            <button className="vote" type="button" aria-pressed={vote === 'n'} onClick={() => setVote('n')}><Thumb down />No</button>
          </div>
          {vote ? <p className="zc33411 t-subhead" role="status">Thanks. This helps us write better guides.</p> : null}
        </section>
      </article>
      <div className="rbar dock">
        <span className="z93d1d3 t-footnote">{g.cat} · {read ? 1 : 0} of {inCat} read</span>
        <button className="mr" type="button" aria-pressed={read} onClick={() => setRead(!read)} style={{ background: read ? 'var(--ok50)' : 'var(--b700)', color: read ? 'var(--ok)' : 'var(--on-ink-1)' }}>
          {read ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg> : null}
          {read ? 'Read' : 'Mark as read'}
        </button>
      </div>
    </Screen>
  );
}
