import type { BentoKey } from '@/site/content/types';

/*
 * Bento card visuals of the homepage: small inline SVG product moments, server-rendered, decorative (the card title
 * and text say what they show). Transparent background: the card's pastel tile shows through. White UI panels bleed
 * off the bottom and fade out. Classes `sv-*` (site.css) animate a before/after loop when motion is welcome; the
 * resting state is the "after" state.
 */

const INK = '#1F0D2C';
const CHIP = { lilac: '#EBDCFB', blue: '#DCE8FF', green: '#DDF3E6', butter: '#FFF0B8', peach: '#FFE1CF', pink: '#FFE0FD', stone: '#F1EDF5' };

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

function Frame({ id, w, h, cycle, fade = 0.68, children }: { id: string; w: number; h: number; cycle?: string; fade?: number; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="site-visual" aria-hidden style={cycle ? ({ '--sv-cycle': cycle } as Style) : undefined}>
      <defs>
        <filter id={`${id}-sh`} x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#3C1E5A" floodOpacity="0.12" />
        </filter>
        <linearGradient id={`${id}-fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset={fade} stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <rect width={w} height={h} fill={`url(#${id}-fg)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`}>{children}</g>
    </svg>
  );
}

function Panel({ id, x, y, w, h, rx = 18 }: { id: string; x: number; y: number; w: number; h: number; rx?: number }) {
  return (
    <g filter={`url(#${id}-sh)`}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="#FFFFFF" stroke="#ECE7F1" />
    </g>
  );
}

function Check({ x, y, tone = 'ok' }: { x: number; y: number; tone?: 'ok' | 'warn' | 'todo' }) {
  if (tone === 'warn') {
    return (
      <g>
        <circle cx={x} cy={y} r={9} fill={CHIP.butter} />
        <path d={`M${x - 4} ${y} h8`} stroke="#8A6A10" strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  }
  if (tone === 'todo') return <circle cx={x} cy={y} r={8} fill="none" stroke="#B9AEC4" strokeWidth={1.8} />;
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill={CHIP.green} />
      <path d={`M${x - 4.5} ${y} l3 3 l5.5 -6`} stroke="#2E7D55" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Tile({ x, y, s = 40, fill, letter }: { x: number; y: number; s?: number; fill: string; letter: string }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.28} fill={fill} />
      <text x={x + s / 2} y={y + s / 2 + 6} fontSize={s * 0.42} textAnchor="middle">
        {letter}
      </text>
    </g>
  );
}

function Pill({ x, y, w, h = 28, fill, label, dark = false, size = 13 }: { x: number; y: number; w: number; h?: number; fill: string; label: string; dark?: boolean; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} textAnchor="middle" style={dark ? { fill: '#FFFFFF' } : undefined}>
        {label}
      </text>
    </g>
  );
}

/** Applications list with statuses (wide card). */
function TrackBento() {
  const id = 'bt-track';
  const rows = [
    { l: 'M', co: 'Maréa', sub: 'Design case · Thu 10:00', st: 'Interview', c: CHIP.lilac, d: 'Oct 15' },
    { l: 'K', co: 'Kiwimo', sub: 'Senior Product Designer', st: 'Applied', c: CHIP.blue, d: 'Oct 2' },
    { l: 'N', co: 'Nordlys Studio', sub: 'Product Designer', st: 'Offer', c: CHIP.green, d: 'Oct 9' },
    { l: 'H', co: 'Halotec', sub: 'UX Designer', st: 'Saved', c: CHIP.stone, d: 'Today' },
  ];
  return (
    <Frame id={id} w={760} h={330} fade={0.84}>
      <Panel id={id} x={36} y={28} w={760} h={360} />
      <text x={64} y={72} fontSize={20}>
        Applications
      </text>
      <text x={64} y={96} fontSize={14} className="m">
        11 active · 2 interviews this week
      </text>
      <Pill x={560} y={52} w={78} h={30} fill={INK} label="Board" dark size={13} />
      <Pill x={644} y={52} w={70} h={30} fill={CHIP.stone} label="Table" size={13} />
      {rows.map((r, i) => {
        const y = 124 + i * 64;
        return (
          <g key={r.co}>
            {i > 0 && <line x1={64} x2={760} y1={y - 12} y2={y - 12} stroke="#F1EDF5" />}
            <Tile x={64} y={y} fill={r.c} letter={r.l} />
            <text x={120} y={y + 18} fontSize={16}>
              {r.co}
            </text>
            <text x={120} y={y + 37} fontSize={13.5} className="m">
              {r.sub}
            </text>
            <Pill x={440} y={y + 6} w={118} fill={r.c} label={r.st} />
            <text x={600} y={y + 25} fontSize={13.5} className="m">
              {r.d}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/** Before/after: a resume is read, the profile fills in. */
function ResumeBento() {
  const id = 'bt-resume';
  const rows = ['Experience · 4 roles', 'Skills · 12 found', 'Education · 2 degrees', 'Languages · 3'];
  return (
    <Frame id={id} w={560} h={340} cycle="7s">
      <g transform="rotate(-5 130 190)">
        <Panel id={id} x={40} y={64} w={176} h={236} rx={12} />
        <rect x={60} y={86} width={92} height={12} rx={6} fill={INK} />
        <rect x={60} y={106} width={124} height={8} rx={4} fill="#D9D2E0" />
        {[138, 154, 170, 202, 218, 234].map((y, i) => (
          <rect key={y} x={60} y={y} width={[136, 118, 128, 136, 104, 120][i]} height={7} rx={3.5} fill="#ECE7F1" />
        ))}
        <rect x={60} y={258} width={44} height={18} rx={9} fill={CHIP.butter} />
        <rect x={110} y={258} width={54} height={18} rx={9} fill={CHIP.butter} />
        <rect x={40} y={64} width={176} height={3} rx={1.5} fill={INK} opacity={0.45} className="sv-scan" style={{ '--sv-travel': '232px' } as Style} />
      </g>
      <text x={52} y={330} fontSize={13} className="m">
        camille-cv.pdf
      </text>
      <path d="M234 182 h30" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="2 7" />
      <path d="M260 175 l8 7 l-8 7" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Panel id={id} x={284} y={34} w={300} h={340} />
      <circle cx={322} cy={76} r={20} fill="#E2B8FF" />
      <text x={322} y={81} fontSize={14} textAnchor="middle">
        CA
      </text>
      <text x={352} y={72} fontSize={16}>
        Camille Aubert
      </text>
      <text x={352} y={92} fontSize={13} className="m">
        Product Designer · Paris
      </text>
      <text x={304} y={132} fontSize={13} className="m">
        Profile
      </text>
      <text x={548} y={132} fontSize={13} textAnchor="end">
        82%
      </text>
      <rect x={304} y={142} width={244} height={8} rx={4} fill="#F1EDF5" />
      <rect x={304} y={142} width={200} height={8} rx={4} fill={INK} className="sv-fill" />
      {rows.map((r, i) => (
        <g key={r} className="sv-row" style={{ '--i': i } as Style}>
          <Check x={314} y={184 + i * 36} />
          <text x={332} y={189 + i * 36} fontSize={15}>
            {r}
          </text>
        </g>
      ))}
    </Frame>
  );
}

/** One search, many boards, results coming in. */
function SearchBento() {
  const id = 'bt-search';
  const rows = [
    { l: 'F', c: CHIP.butter, role: 'Product Designer', co: 'Ferma · Paris · Hybrid', isNew: true },
    { l: 'L', c: CHIP.blue, role: 'UX Designer', co: 'Lumio · Remote' },
    { l: 'O', c: CHIP.green, role: 'Design Lead', co: 'Orbe · Paris' },
  ];
  return (
    <Frame id={id} w={470} h={340} cycle="7s">
      <Panel id={id} x={36} y={30} w={524} h={340} />
      <rect x={60} y={54} width={386} height={46} rx={12} fill="#F8F6FA" stroke="#ECE7F1" />
      <circle cx={84} cy={76} r={7.5} stroke={INK} strokeWidth={2} fill="none" />
      <path d="M90 82 l6 6" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <text x={106} y={82} fontSize={16}>
        Product Designer, Paris
      </text>
      <Pill x={60} y={114} w={92} h={30} fill={INK} label="8 boards" dark />
      <Pill x={160} y={114} w={78} h={30} fill={CHIP.stone} label="Hybrid" />
      <Pill x={246} y={114} w={72} h={30} fill={CHIP.stone} label="€55k+" />
      {rows.map((r, i) => {
        const y = 164 + i * 58;
        return (
          <g key={r.role + r.co} className="sv-row" style={{ '--i': i } as Style}>
            <Tile x={60} y={y} s={38} fill={r.c} letter={r.l} />
            <text x={112} y={y + 17} fontSize={15}>
              {r.role}
            </text>
            <text x={112} y={y + 35} fontSize={13} className="m">
              {r.co}
            </text>
            {r.isNew && <Pill x={394} y={y + 6} w={52} h={24} fill={CHIP.green} label="New" size={12} />}
          </g>
        );
      })}
    </Frame>
  );
}

/** Before/after: an offer, then how well it matches. */
function MatchBento() {
  const id = 'bt-match';
  const c = 2 * Math.PI * 30;
  const rows: { t: string; tone: 'ok' | 'warn' }[] = [
    { t: 'Design systems', tone: 'ok' },
    { t: 'B2B SaaS', tone: 'ok' },
    { t: 'Team lead · to highlight', tone: 'warn' },
  ];
  return (
    <Frame id={id} w={470} h={340} cycle="7s">
      <Panel id={id} x={36} y={30} w={524} h={340} />
      <Tile x={60} y={56} s={46} fill={CHIP.lilac} letter="N" />
      <text x={120} y={76} fontSize={17}>
        Lead Product Designer
      </text>
      <text x={120} y={97} fontSize={13} className="m">
        Nimbalo · Paris · On-site
      </text>
      <circle cx={400} cy={80} r={30} fill="none" stroke="#F1EDF5" strokeWidth={7} />
      <circle
        cx={400}
        cy={80}
        r={30}
        fill="none"
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * 0.14}
        transform="rotate(-90 400 80)"
        className="sv-ring"
        style={{ '--sv-ring-from': c, '--sv-ring-to': c * 0.14 } as Style}
      />
      <text x={400} y={86} fontSize={16} textAnchor="middle">
        86%
      </text>
      <line x1={60} x2={446} y1={132} y2={132} stroke="#F1EDF5" />
      <text x={60} y={162} fontSize={13} className="m">
        Why it fits you
      </text>
      {rows.map((r, i) => (
        <g key={r.t} className="sv-row" style={{ '--i': i + 1 } as Style}>
          <Check x={70} y={190 + i * 34} tone={r.tone} />
          <text x={88} y={195 + i * 34} fontSize={15}>
            {r.t}
          </text>
        </g>
      ))}
    </Frame>
  );
}

/** New offers arriving as notifications. */
function AlertsBento() {
  const id = 'bt-alerts';
  const toasts = [
    { role: 'Product Designer', co: 'Ferma · Paris · just now', cta: true },
    { role: 'UX Designer', co: 'Lumio · Remote · 1 h ago' },
    { role: 'Design Lead', co: 'Orbe · Paris · 3 h ago' },
  ];
  return (
    <Frame id={id} w={470} h={340} cycle="6s">
      {toasts.map((t, i) => {
        const y = 40 + i * 96;
        return (
          <g key={t.role} className={i === 0 ? 'sv-drop' : undefined} opacity={i === 2 ? 0.75 : 1}>
            <Panel id={id} x={40} y={y} w={398} h={80} />
            <circle cx={80} cy={y + 40} r={20} fill={CHIP.green} />
            <path
              d={`M${80 - 7} ${y + 44} v-5 a7 7 0 0 1 14 0 v5 l2 3 h-18 z M${80 - 3} ${y + 50} a3 3 0 0 0 6 0`}
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <text x={114} y={y + 36} fontSize={15}>
              New match · {t.role}
            </text>
            <text x={114} y={y + 57} fontSize={13} className="m">
              {t.co}
            </text>
            {t.cta && <Pill x={360} y={y + 26} w={62} h={28} fill={INK} label="View" dark />}
          </g>
        );
      })}
    </Frame>
  );
}

/** An interview round with its prep checklist. */
function PrepareBento() {
  const id = 'bt-prepare';
  const items: { t: string; tone: 'ok' | 'todo' }[] = [
    { t: 'Re-read the brief', tone: 'ok' },
    { t: 'Pick two case studies', tone: 'ok' },
    { t: 'Questions to ask the team', tone: 'todo' },
  ];
  return (
    <Frame id={id} w={600} h={340}>
      <Panel id={id} x={36} y={30} w={600} h={340} />
      <text x={64} y={74} fontSize={19}>
        Design case
      </text>
      <text x={64} y={97} fontSize={13.5} className="m">
        Maréa · Thu 15 Oct, 10:00
      </text>
      <circle cx={512} cy={76} r={18} fill={CHIP.peach} />
      <text x={512} y={81} fontSize={12.5} textAnchor="middle">
        LM
      </text>
      <circle cx={540} cy={76} r={18} fill={CHIP.blue} stroke="#FFFFFF" strokeWidth={3} />
      <text x={540} y={81} fontSize={12.5} textAnchor="middle">
        JD
      </text>
      <line x1={78} x2={330} y1={136} y2={136} stroke="#ECE7F1" strokeWidth={3} />
      <line x1={78} x2={162} y1={136} y2={136} stroke={INK} strokeWidth={3} />
      {[78, 162, 246, 330].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={136} r={i === 1 ? 11 : 9} fill={i === 0 ? INK : i === 1 ? '#FFFFFF' : '#ECE7F1'} stroke={i === 1 ? INK : 'none'} strokeWidth={2.5} />
          {i === 0 && <path d={`M${x - 4} 136 l3 3 l5 -6`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </g>
      ))}
      <text x={350} y={141} fontSize={13} className="m">
        Round 2 of 4
      </text>
      <text x={64} y={186} fontSize={13} className="m">
        Prep notes
      </text>
      {items.map((it, i) => (
        <g key={it.t}>
          <Check x={74} y={214 + i * 34} tone={it.tone} />
          <text x={92} y={219 + i * 34} fontSize={15} className={it.tone === 'todo' ? 'm' : undefined}>
            {it.t}
          </text>
        </g>
      ))}
    </Frame>
  );
}

/** A cover letter drafting itself, line by line. */
function LetterBento() {
  const id = 'bt-letter';
  const lines = [
    [340, 316, 330, 200],
    [332, 304, 256],
  ];
  let n = 0;
  return (
    <Frame id={id} w={470} h={340} cycle="7s">
      <Panel id={id} x={36} y={30} w={400} h={340} />
      <text x={64} y={70} fontSize={13} className="m">
        Cover letter · Nimbalo
      </text>
      <Pill x={344} y={52} w={78} h={26} fill={CHIP.lilac} label="Draft" size={12} />
      <text x={64} y={112} fontSize={16}>
        Dear Nimbalo team,
      </text>
      {lines.map((para, p) =>
        para.map((w, i) => {
          const y = 134 + p * 108 + i * 22;
          const k = n++;
          return <rect key={`${p}-${i}`} x={64} y={y} width={w} height={9} rx={4.5} fill={k === 2 ? '#D7C5F7' : '#E4DEEA'} className="sv-fill" style={{ '--i': k } as Style} />;
        }),
      )}
    </Frame>
  );
}

/** An application form filled from the profile. */
function AutofillBento() {
  const id = 'bt-autofill';
  const fields = [
    { label: 'Full name', value: 'Camille Aubert' },
    { label: 'Email', value: 'camille@aubert.me' },
    { label: 'Resume', value: 'camille-cv.pdf' },
  ];
  return (
    <Frame id={id} w={360} h={330} cycle="7s">
      <Panel id={id} x={28} y={28} w={420} h={340} rx={16} />
      <circle cx={50} cy={50} r={5} fill="#F2B8B5" />
      <circle cx={66} cy={50} r={5} fill="#F6DFA0" />
      <circle cx={82} cy={50} r={5} fill="#C1EABE" />
      <line x1={28} x2={448} y1={72} y2={72} stroke="#F1EDF5" />
      {fields.map((f, i) => {
        const y = 100 + i * 70;
        return (
          <g key={f.label}>
            <text x={52} y={y} fontSize={12.5} className="m">
              {f.label}
            </text>
            <rect x={52} y={y + 9} width={290} height={38} rx={10} fill="#FFFFFF" stroke="#E4DEEA" strokeWidth={1.5} />
            <g className="sv-row" style={{ '--i': i } as Style}>
              <rect x={53} y={y + 10} width={288} height={36} rx={9} fill="#F7F1FD" />
              <text x={66} y={y + 33} fontSize={14.5}>
                {f.value}
              </text>
            </g>
          </g>
        );
      })}
    </Frame>
  );
}

const BENTO: Record<BentoKey, () => React.ReactNode> = {
  track: TrackBento,
  resume: ResumeBento,
  search: SearchBento,
  match: MatchBento,
  alerts: AlertsBento,
  prepare: PrepareBento,
  letter: LetterBento,
  autofill: AutofillBento,
};

export function BentoVisual({ name }: { name: BentoKey }) {
  const V = BENTO[name];
  return <V />;
}
