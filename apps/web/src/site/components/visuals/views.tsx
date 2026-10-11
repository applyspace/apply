import { PLUME_PATH } from '@/site/components/ui/Plume';
import type { ViewKey } from '@/site/content/types';
import { HOME_MAP, mapPoint } from '@/site/lib/homeMap';

/*
 * The four views of the applications hub (Board, Table, Timeline, Map) as Linear-like product images: the app window
 * straight on the page, fading into the background at the bottom. Inline SVG, server-rendered, same data in every view.
 */

const INK = '#1F0D2C';
const TONE = {
  saved: { fill: '#F1EDF5', dot: '#B9AEC4', label: 'Saved' },
  applied: { fill: '#DCE8FF', dot: '#8FB0F5', label: 'Applied' },
  interview: { fill: '#EBDCFB', dot: '#C9A4F2', label: 'Interview' },
  offer: { fill: '#DDF3E6', dot: '#8CCB9A', label: 'Offer' },
} as const;
type Status = keyof typeof TONE;

const TILE = { butter: '#FFF0B8', blue: '#DCE8FF', green: '#DDF3E6', pink: '#FFE0FD', peach: '#FFE1CF', lilac: '#EBDCFB' };

type App = { co: string; role: string; city: string; mode: string; status: Status; tile: string; applied: string; next?: string; start: number; end: number; lon: number; lat: number };

/** Days are counted from Mon 14 Sep (Timeline); today is Sun 11 Oct (day 27). */
const APPS: App[] = [
  { co: 'Ferma', role: 'Product Designer', city: 'Paris', mode: 'Hybrid', status: 'saved', tile: TILE.butter, applied: '—', start: 26, end: 27, lon: 2.3622, lat: 48.859 },
  { co: 'Lumio', role: 'UX Designer', city: 'Paris', mode: 'Remote', status: 'saved', tile: TILE.blue, applied: '—', start: 25, end: 27, lon: 2.3015, lat: 48.8744 },
  { co: 'Kiwimo', role: 'Senior Product Designer', city: 'Paris', mode: 'Hybrid', status: 'applied', tile: TILE.green, applied: 'Sep 18', next: 'Send portfolio', start: 4, end: 27, lon: 2.317, lat: 48.885 },
  { co: 'Talma', role: 'Product Designer', city: 'Paris', mode: 'Remote', status: 'applied', tile: TILE.pink, applied: 'Sep 29', start: 15, end: 27, lon: 2.3866, lat: 48.8648 },
  { co: 'Brisa', role: 'UI Designer', city: 'Paris', mode: 'Hybrid', status: 'applied', tile: TILE.peach, applied: 'Oct 4', start: 20, end: 27, lon: 2.366, lat: 48.872 },
  { co: 'Maréa', role: 'Design case', city: 'Paris', mode: 'On-site', status: 'interview', tile: TILE.lilac, applied: 'Sep 22', next: 'Thu 10:00', start: 8, end: 31, lon: 2.369, lat: 48.853 },
  { co: 'Nimbalo', role: 'Lead Product Designer', city: 'Paris', mode: 'On-site', status: 'interview', tile: TILE.blue, applied: 'Sep 25', next: 'Fri 14:30', start: 11, end: 32, lon: 2.2985, lat: 48.8575 },
  { co: 'Solène', role: 'Product Designer', city: 'Paris', mode: 'Hybrid', status: 'offer', tile: TILE.pink, applied: 'Sep 16', next: 'Reply by Mon', start: 2, end: 29, lon: 2.333, lat: 48.853 },
];

const W = 1200;
const H = 540;
const X0 = 240; // content left
const X1 = 1170; // content right

function Window({ id, view, children }: { id: string; view: ViewKey; children: React.ReactNode }) {
  const tabs: { key: ViewKey; label: string; w: number }[] = [
    { key: 'board', label: 'Board', w: 70 },
    { key: 'table', label: 'Table', w: 66 },
    { key: 'timeline', label: 'Timeline', w: 88 },
    { key: 'map', label: 'Map', w: 58 },
  ];
  let tx = X1 - tabs.reduce((s, t) => s + t.w, 0) - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="site-visual" aria-hidden>
      <defs>
        <linearGradient id={`${id}-fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill={`url(#${id}-fg)`} />
        </mask>
        <clipPath id={`${id}-win`}>
          <rect x={1} y={1} width={W - 2} height={H + 100} rx={18} />
        </clipPath>
      </defs>
      <g mask={`url(#${id}-m)`}>
        <rect x={1} y={1} width={W - 2} height={H + 100} rx={18} fill="#FFFFFF" stroke="#E4DEEA" strokeWidth={1.5} />
        <g clipPath={`url(#${id}-win)`}>
          <rect x={1} y={1} width={209} height={H + 100} fill="#FAF7FD" />
          <line x1={210} x2={210} y1={1} y2={H + 100} stroke="#ECE7F1" />
          <circle cx={26} cy={26} r={6} fill="#F2B8B5" />
          <circle cx={46} cy={26} r={6} fill="#F6DFA0" />
          <circle cx={66} cy={26} r={6} fill="#C1EABE" />
          <svg x={24} y={56} width={32} height={19} viewBox="40 100 350 205">
            <path fill={INK} d={PLUME_PATH} />
          </svg>
          <text x={64} y={72} fontSize={17}>
            apply
          </text>
          {['Search', 'Offers', 'Applications', 'Interviews', 'Profile'].map((label, i) => {
            const y = 108 + i * 40;
            const on = label === 'Applications';
            return (
              <g key={label}>
                {on && <rect x={14} y={y - 8} width={182} height={34} rx={9} fill="#EFE6FA" />}
                <rect x={28} y={y + 2} width={14} height={14} rx={4} fill="none" stroke={on ? INK : '#9A8FA6'} strokeWidth={1.8} />
                <text x={54} y={y + 14} fontSize={15} className={on ? undefined : 'm'}>
                  {label}
                </text>
              </g>
            );
          })}
          <text x={X0} y={62} fontSize={24}>
            Applications
          </text>
          <text x={X0} y={88} fontSize={14} className="m">
            8 active · 2 interviews this week
          </text>
          <rect x={tx - 4} y={38} width={X1 - tx + 8} height={40} rx={20} fill="#F5F2F8" />
          {tabs.map((t) => {
            const x = tx;
            tx += t.w;
            const on = t.key === view;
            return (
              <g key={t.key}>
                {on && <rect x={x} y={42} width={t.w} height={32} rx={16} fill={INK} />}
                <text x={x + t.w / 2} y={63} fontSize={14} textAnchor="middle" style={{ fill: on ? '#FFFFFF' : '#6B5F78' }}>
                  {t.label}
                </text>
              </g>
            );
          })}
          {children}
        </g>
      </g>
    </svg>
  );
}

function Tile({ x, y, s, fill, letter }: { x: number; y: number; s: number; fill: string; letter: string }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.28} fill={fill} />
      <text x={x + s / 2} y={y + s / 2 + s * 0.16} fontSize={s * 0.44} textAnchor="middle">
        {letter}
      </text>
    </g>
  );
}

function BoardView() {
  const cols: Status[] = ['saved', 'applied', 'interview', 'offer'];
  const cw = 222;
  const gap = (X1 - X0 - cw * 4) / 3;
  return (
    <Window id="vw-board" view="board">
      {cols.map((status, c) => {
        const x = X0 + c * (cw + gap);
        const items = APPS.filter((a) => a.status === status);
        let y = 160;
        return (
          <g key={status}>
            <rect x={x} y={112} width={cw} height={700} rx={14} fill="#FAF7FD" />
            <circle cx={x + 20} cy={137} r={5} fill={TONE[status].dot} />
            <text x={x + 34} y={142} fontSize={15}>
              {TONE[status].label}
            </text>
            <text x={x + cw - 16} y={142} fontSize={14} textAnchor="end" className="l">
              {items.length}
            </text>
            {items.map((a) => {
              const h = a.next ? 118 : 86;
              const top = y;
              y += h + 10;
              return (
                <g key={a.co}>
                  <rect x={x + 10} y={top} width={cw - 20} height={h} rx={12} fill="#FFFFFF" stroke="#ECE7F1" />
                  <Tile x={x + 24} y={top + 16} s={32} fill={a.tile} letter={a.co[0]} />
                  <text x={x + 66} y={top + 29} fontSize={14}>
                    {a.role.length > 20 ? `${a.role.slice(0, 19)}…` : a.role}
                  </text>
                  <text x={x + 66} y={top + 47} fontSize={13} className="m">
                    {a.co}
                  </text>
                  <text x={x + 24} y={top + 72} fontSize={12.5} className="l">
                    {a.city} · {a.mode}
                  </text>
                  {a.next && (
                    <g>
                      <rect x={x + 24} y={top + 84} width={a.next.length * 7.4 + 24} height={24} rx={12} fill={TONE[a.status].fill} />
                      <text x={x + 36} y={top + 100} fontSize={12}>
                        {a.next}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </Window>
  );
}

function TableView() {
  const cols = [
    { label: 'Company', x: X0 + 16 },
    { label: 'Role', x: 450 },
    { label: 'Status', x: 680 },
    { label: 'Location', x: 820 },
    { label: 'Applied', x: 960 },
    { label: 'Next', x: 1060 },
  ];
  return (
    <Window id="vw-table" view="table">
      <rect x={X0} y={112} width={X1 - X0} height={44} rx={10} fill="#FAF7FD" />
      {cols.map((c) => (
        <text key={c.label} x={c.x} y={140} fontSize={13} className="m">
          {c.label}
        </text>
      ))}
      {APPS.map((a, i) => {
        const y = 156 + i * 56;
        return (
          <g key={a.co}>
            <line x1={X0} x2={X1} y1={y + 56} y2={y + 56} stroke="#F1EDF5" />
            <Tile x={X0 + 16} y={y + 14} s={28} fill={a.tile} letter={a.co[0]} />
            <text x={X0 + 56} y={y + 33} fontSize={14.5}>
              {a.co}
            </text>
            <text x={450} y={y + 33} fontSize={14.5}>
              {a.role}
            </text>
            <rect x={680} y={y + 15} width={TONE[a.status].label.length * 7.6 + 30} height={26} rx={13} fill={TONE[a.status].fill} />
            <circle cx={693} cy={y + 28} r={4} fill={TONE[a.status].dot} />
            <text x={704} y={y + 33} fontSize={13}>
              {TONE[a.status].label}
            </text>
            <text x={820} y={y + 33} fontSize={14} className="m">
              {a.city} · {a.mode}
            </text>
            <text x={960} y={y + 33} fontSize={14} className="m">
              {a.applied}
            </text>
            <text x={1060} y={y + 33} fontSize={14} className={a.next ? undefined : 'l'}>
              {a.next ?? '—'}
            </text>
          </g>
        );
      })}
    </Window>
  );
}

function TimelineView() {
  const gx = 420;
  const day = (X1 - gx) / 42;
  const weeks = ['Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12', 'Oct 19'];
  const today = gx + 27.5 * day;
  const rows = [...APPS].sort((a, b) => a.start - b.start);
  return (
    <Window id="vw-timeline" view="timeline">
      {weeks.map((w, i) => (
        <g key={w}>
          <line x1={gx + i * 7 * day} x2={gx + i * 7 * day} y1={130} y2={H + 100} stroke="#F1EDF5" />
          <text x={gx + i * 7 * day + 10} y={136} fontSize={13} className="m">
            {w}
          </text>
        </g>
      ))}
      <line x1={today} x2={today} y1={148} y2={H + 100} stroke={INK} strokeWidth={1.5} strokeDasharray="3 4" />
      <rect x={today - 26} y={118} width={52} height={24} rx={12} fill={INK} />
      <text x={today} y={135} fontSize={12} textAnchor="middle" style={{ fill: '#FFFFFF' }}>
        Today
      </text>
      {rows.map((a, i) => {
        const y = 166 + i * 58;
        const x = gx + a.start * day;
        const w = Math.max((a.end - a.start) * day, 34);
        return (
          <g key={a.co}>
            <Tile x={X0} y={y + 6} s={28} fill={a.tile} letter={a.co[0]} />
            <text x={X0 + 40} y={y + 19} fontSize={14.5}>
              {a.co}
            </text>
            <text x={X0 + 40} y={y + 37} fontSize={12.5} className="m">
              {a.role.length > 18 ? `${a.role.slice(0, 17)}…` : a.role}
            </text>
            <rect x={x} y={y + 6} width={w} height={30} rx={15} fill={TONE[a.status].fill} />
            <circle cx={x + 15} cy={y + 21} r={4.5} fill={TONE[a.status].dot} />
            {w > 120 && (
              <text x={x + 28} y={y + 26} fontSize={13}>
                {TONE[a.status].label}
                {a.next ? ` · ${a.next}` : ''}
              </text>
            )}
            {a.status === 'interview' && (
              <rect x={gx + a.end * day - 7} y={y + 14} width={14} height={14} rx={3} transform={`rotate(45 ${gx + a.end * day} ${y + 21})`} fill={INK} />
            )}
          </g>
        );
      })}
    </Window>
  );
}

/** Stylised Paris (Seine, ring road, parks) for when the real map image is not configured. */
function MapFallback({ x, y }: { x: number; y: number }) {
  const pt = (lon: number, lat: number) => {
    const [px, py] = mapPoint(lon, lat);
    return `${(x + px).toFixed(1)} ${(y + py).toFixed(1)}`;
  };
  const seine = [
    [2.24, 48.832], [2.262, 48.846], [2.28, 48.855], [2.297, 48.862], [2.317, 48.864], [2.335, 48.858], [2.352, 48.852], [2.367, 48.846], [2.383, 48.836], [2.41, 48.823], [2.44, 48.815],
  ];
  const ring = [
    [2.255, 48.862], [2.28, 48.893], [2.32, 48.9], [2.365, 48.899], [2.398, 48.885], [2.411, 48.855], [2.4, 48.828], [2.36, 48.818], [2.31, 48.82], [2.272, 48.838], [2.255, 48.862],
  ];
  // Main boulevards (thick) and avenues radiating from Étoile, Bastille and Nation (thin).
  const blvd = [
    [[2.295, 48.874], [2.33, 48.871], [2.36, 48.869], [2.38, 48.861], [2.396, 48.848]],
    [[2.3, 48.845], [2.335, 48.842], [2.36, 48.836], [2.38, 48.845]],
    [[2.347, 48.897], [2.348, 48.87], [2.345, 48.85], [2.34, 48.822]],
    [[2.275, 48.88], [2.3, 48.865], [2.322, 48.852], [2.35, 48.83]],
  ];
  const avenues = [
    [[2.295, 48.8738], [2.272, 48.861]], [[2.295, 48.8738], [2.283, 48.893]], [[2.295, 48.8738], [2.318, 48.883]], [[2.295, 48.8738], [2.33, 48.866]],
    [[2.295, 48.8738], [2.3, 48.857]], [[2.369, 48.853], [2.396, 48.848]], [[2.369, 48.853], [2.38, 48.868]], [[2.369, 48.853], [2.39, 48.838]],
    [[2.396, 48.848], [2.41, 48.838]], [[2.396, 48.848], [2.406, 48.866]], [[2.32, 48.885], [2.36, 48.884], [2.39, 48.877]],
    [[2.31, 48.83], [2.33, 48.833], [2.36, 48.828]], [[2.33, 48.894], [2.333, 48.875]], [[2.38, 48.893], [2.37, 48.87]],
  ];
  const parks: [number, number, number, number, number][] = [
    [2.249, 48.862, 26, 46, -10], [2.437, 48.835, 34, 22, 0], [2.3825, 48.8795, 14, 10, 0], [2.3372, 48.8462, 11, 8, 0],
    [2.2985, 48.8558, 6, 22, -38], [2.327, 48.8635, 14, 5, -12], [2.4, 48.86, 9, 7, 0], [2.313, 48.8795, 7, 6, 0],
  ];
  const path = (pts: number[][]) => `M${pts.map(([lo, la]) => pt(lo, la)).join(' L')}`;
  return (
    <g>
      <rect x={x} y={y} width={HOME_MAP.width} height={HOME_MAP.height} fill="#F6F3F8" />
      {parks.map(([lo, la, rx, ry, rot]) => {
        const [px, py] = mapPoint(lo, la);
        return <ellipse key={`${lo}-${la}`} cx={x + px} cy={y + py} rx={rx} ry={ry} transform={`rotate(${rot} ${x + px} ${y + py})`} fill="#DDEFD9" />;
      })}
      {avenues.map((a, i) => (
        <path key={i} d={path(a)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <path d={path(ring)} fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinejoin="round" />
      <path d={path(ring)} fill="none" stroke="#ECE4F2" strokeWidth={2} strokeLinejoin="round" />
      {blvd.map((b, i) => (
        <path key={i} d={path(b)} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <path d={path(seine)} fill="none" stroke="#CFE0FB" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function MapView({ mapSrc }: { mapSrc?: string }) {
  const x = X0;
  const y = 112;
  return (
    <Window id="vw-map" view="map">
      <defs>
        <clipPath id="vw-map-area">
          <rect x={x} y={y} width={HOME_MAP.width} height={HOME_MAP.height} rx={14} />
        </clipPath>
      </defs>
      <g clipPath="url(#vw-map-area)">
        {mapSrc ? <image href={mapSrc} x={x} y={y} width={HOME_MAP.width} height={HOME_MAP.height} preserveAspectRatio="xMidYMid slice" /> : <MapFallback x={x} y={y} />}
      </g>
      {APPS.map((a) => {
        const [px, py] = mapPoint(a.lon, a.lat);
        const cx = x + px;
        const cy = y + py;
        const w = a.co.length * 8.4 + 46;
        return (
          <g key={a.co}>
            <path d={`M${cx - 6} ${cy - 10} L${cx} ${cy} L${cx + 6} ${cy - 10} Z`} fill={INK} />
            <rect x={cx - w / 2} y={cy - 44} width={w} height={34} rx={17} fill={INK} />
            <rect x={cx - w / 2 + 5} y={cy - 39} width={24} height={24} rx={12} fill={a.tile} />
            <text x={cx - w / 2 + 17} y={cy - 22} fontSize={12} textAnchor="middle">
              {a.co[0]}
            </text>
            <text x={cx - w / 2 + 36} y={cy - 22} fontSize={13.5} style={{ fill: '#FFFFFF' }}>
              {a.co}
            </text>
          </g>
        );
      })}
    </Window>
  );
}

/** One view of the applications hub. `mapSrc`: the real map image (Map view), when configured. */
export function ViewVisual({ view, mapSrc }: { view: ViewKey; mapSrc?: string }) {
  if (view === 'table') return <TableView />;
  if (view === 'timeline') return <TimelineView />;
  if (view === 'map') return <MapView mapSrc={mapSrc} />;
  return <BoardView />;
}
