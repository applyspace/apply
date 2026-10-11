import { PLUME_PATH } from '@/site/components/ui/Plume';

/* Device sketches of the Apps section (desktop, mobile, Chrome extension): inline SVG, decorative, 400x220. */

const INK = '#1F0D2C';

function Plume({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <svg x={x} y={y} width={w} height={w * 0.586} viewBox="40 100 350 205">
      <path fill={INK} d={PLUME_PATH} />
    </svg>
  );
}

function Lines({ x, y, widths, gap = 16 }: { x: number; y: number; widths: number[]; gap?: number }) {
  return (
    <>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={8} rx={4} fill={i === 0 ? '#D9D2E0' : '#ECE7F1'} />
      ))}
    </>
  );
}

function DesktopSketch() {
  return (
    <>
      <rect x={60} y={36} width={300} height={200} rx={14} fill="#FFFFFF" stroke="#ECE7F1" strokeWidth={1.5} />
      <rect x={61} y={37} width={70} height={198} rx={13} fill="#FAF7FD" />
      <circle cx={76} cy={52} r={4} fill="#F2B8B5" />
      <circle cx={89} cy={52} r={4} fill="#F6DFA0" />
      <circle cx={102} cy={52} r={4} fill="#C1EABE" />
      <Plume x={74} y={70} w={22} />
      <Lines x={74} y={98} widths={[42, 36, 44, 32]} gap={18} />
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <rect x={146 + c * 70} y={60} width={62} height={176} rx={8} fill="#FAF7FD" />
          {[0, 1, 2].slice(0, 3 - c).map((r) => (
            <rect key={r} x={151 + c * 70} y={80 + r * 44} width={52} height={36} rx={6} fill="#FFFFFF" stroke="#ECE7F1" />
          ))}
        </g>
      ))}
    </>
  );
}

function MobileSketch() {
  return (
    <>
      <rect x={140} y={24} width={120} height={230} rx={24} fill="#FFFFFF" stroke="#ECE7F1" strokeWidth={1.5} />
      <rect x={180} y={34} width={40} height={8} rx={4} fill="#ECE7F1" />
      <text x={156} y={70} fontSize={12}>
        Today
      </text>
      <rect x={154} y={80} width={92} height={50} rx={10} fill="#EBDCFB" />
      <text x={164} y={100} fontSize={10.5}>
        Design case
      </text>
      <text x={164} y={117} fontSize={9.5} className="m">
        Thu 10:00 · Maréa
      </text>
      <rect x={154} y={138} width={92} height={36} rx={10} fill="#FAF7FD" />
      <rect x={154} y={180} width={92} height={36} rx={10} fill="#FAF7FD" />
      <Lines x={164} y={150} widths={[56]} />
      <Lines x={164} y={192} widths={[48]} />
    </>
  );
}

function ExtensionSketch() {
  return (
    <>
      <rect x={40} y={36} width={320} height={200} rx={14} fill="#FFFFFF" stroke="#ECE7F1" strokeWidth={1.5} />
      <rect x={58} y={50} width={200} height={22} rx={11} fill="#F5F2F8" />
      <rect x={326} y={51} width={20} height={20} rx={6} fill="#EBDCFB" />
      <Plume x={329} y={56} w={14} />
      <Lines x={60} y={94} widths={[120, 150, 136, 90]} gap={20} />
      <rect x={200} y={78} width={150} height={132} rx={12} fill="#FFFFFF" stroke="#ECE7F1" strokeWidth={1.5} />
      <text x={214} y={102} fontSize={12}>
        Save to apply
      </text>
      <rect x={214} y={114} width={122} height={24} rx={7} fill="#FAF7FD" />
      <rect x={214} y={144} width={122} height={24} rx={7} fill="#FAF7FD" />
      <Lines x={222} y={122} widths={[70]} />
      <Lines x={222} y={152} widths={[56]} />
      <rect x={214} y={176} width={122} height={24} rx={12} fill={INK} />
      <text x={275} y={192} fontSize={11} textAnchor="middle" style={{ fill: '#FFFFFF' }}>
        Save offer
      </text>
    </>
  );
}

const SKETCH = { desktop: DesktopSketch, mobile: MobileSketch, extension: ExtensionSketch };

export function DeviceVisual({ name }: { name: keyof typeof SKETCH }) {
  const S = SKETCH[name];
  return (
    <svg viewBox="0 0 400 236" className="site-visual" aria-hidden>
      <S />
    </svg>
  );
}
