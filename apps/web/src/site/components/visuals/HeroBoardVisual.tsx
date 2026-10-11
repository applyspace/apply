import type { VisualProps } from './types';

/** Generated from 00-hero-board.svg (design handoff, 11 Oct 2026). Text is set in Geist through `.site-visual` (site.css). */
export function HeroBoardVisual({ idPrefix = '', className, decorative = false }: VisualProps) {
  const p = `heroboard-${idPrefix}`;
  return (
    <svg
      viewBox="0 0 1440 900"
      className={['site-visual', className].filter(Boolean).join(' ')}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': "The apply desktop app showing applications on a board, from saved to offer" })}
    >
      <defs><linearGradient id={`${p}tpeach`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1C2BE" /><stop offset="1" stopColor="#FFDEC0" /></linearGradient><linearGradient id={`${p}tblue`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ABC8FF" /><stop offset="1" stopColor="#BBD9FF" /></linearGradient><linearGradient id={`${p}tgreen`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B5D5BD" /><stop offset="1" stopColor="#C1EABE" /></linearGradient><linearGradient id={`${p}tlilac`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D7C5F7" /><stop offset="1" stopColor="#E7DDFA" /></linearGradient><linearGradient id={`${p}tbutter`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3D98F" /><stop offset="1" stopColor="#FFEDBE" /></linearGradient><linearGradient id={`${p}tpink`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFADF8" /><stop offset="1" stopColor="#FFC8FB" /></linearGradient>
      <linearGradient id={`${p}panel`} x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#F1C2BE" /><stop offset="0.35" stopColor="#E7C9F5" /><stop offset="0.7" stopColor="#C9D3FB" /><stop offset="1" stopColor="#C8E6CC" /></linearGradient>
      <linearGradient id={`${p}fm`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.62" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
      <mask id={`${p}m`} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900"><rect width="1440" height="900" fill={`url(#${p}fm)`} /></mask>
      <clipPath id={`${p}win`}><rect x="96" y="88" width="1248" height="900" rx="16" /></clipPath>
      <filter id={`${p}sh`} x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#3C1E5A" floodOpacity="0.16" /></filter>
      <filter id={`${p}cs`} x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#3C1E5A" floodOpacity="0.08" /></filter>
      </defs>
      <g mask={`url(#${p}m)`}>
      <rect width="1440" height="900" rx="28" fill={`url(#${p}panel)`} />
      <g filter={`url(#${p}sh)`}><rect x="96" y="88" width="1248" height="900" rx="16" fill="#FFFFFF" /></g>
      <g clipPath={`url(#${p}win)`}>
      <rect x="96" y="88" width="232" height="900" fill="#FAF7FD" /><line x1="328" y1="88" x2="328" y2="988" stroke="#ECE7F1" />
      <circle cx="122" cy="114" r="6" fill="#F2B8B5" /><circle cx="142" cy="114" r="6" fill="#F6DFA0" /><circle cx="162" cy="114" r="6" fill="#C1EABE" />
      <svg x="122" y="156" width="34" height="20" viewBox="40 100 350 205"><path fill="#1F0D2C" d="M305.446 104C311.182 104 316.053 108.675 316.922 115.06C320.789 143.482 331.189 219.414 336.89 256.226L376.912 223.214C382.627 218.501 389.205 226.979 384.256 232.686C361.599 258.809 336.534 287.203 324.477 299.143C321.614 301.979 317.551 300.418 316.52 296.284C305.791 253.234 290.208 179.201 284.508 151.82C283.231 145.683 278.258 141.442 272.667 141.723L185.916 146.089C170.431 146.868 155.77 154.551 146.961 168.913C137.199 184.828 124.688 208.542 116.231 236.673C114.987 240.809 117.787 245.019 121.664 244.923C184.751 243.362 214.688 222.428 246.201 183.302C248.249 180.759 252.018 181.754 252.795 185.074C278.214 293.786 211.561 316.018 59.5191 298.755C50.5632 297.738 44.3155 288.227 46.4044 278.367C58.8702 219.527 81.1871 174.152 99.4481 144.458C116.428 116.847 145.4 104 175.225 104L305.446 104Z" /></svg>
      <text x="164" y="174" fontSize="17" fontWeight="600">apply</text>
      <rect x="126" y="210" width="14" height="14" rx="4" fill="none" stroke="#9A8FA6" strokeWidth="1.8" />
      <text x="152" y="222" fontSize="15" fontWeight="600" className="m">Search</text>
      <rect x="126" y="252" width="14" height="14" rx="4" fill="none" stroke="#9A8FA6" strokeWidth="1.8" />
      <text x="152" y="264" fontSize="15" fontWeight="600" className="m">Offers</text>
      <rect x="110" y="284" width="204" height="34" rx="9" fill="#EFE6FA" />
      <rect x="126" y="294" width="14" height="14" rx="4" fill="none" stroke="#1F0D2C" strokeWidth="1.8" />
      <text x="152" y="306" fontSize="15" fontWeight="600" className="">Applications</text>
      <rect x="126" y="336" width="14" height="14" rx="4" fill="none" stroke="#9A8FA6" strokeWidth="1.8" />
      <text x="152" y="348" fontSize="15" fontWeight="600" className="m">Interviews</text>
      <rect x="126" y="378" width="14" height="14" rx="4" fill="none" stroke="#9A8FA6" strokeWidth="1.8" />
      <text x="152" y="390" fontSize="15" fontWeight="600" className="m">Profile</text>
      <text x="360" y="150" fontSize="26" fontWeight="600">Applications</text><text x="360" y="176" fontSize="15" className="m">10 active · 2 interviews this week</text>
      <rect x="968" y="128" width="68" height="32" rx="16" fill="#1F0D2C" />
      <text x="1002.0" y="149" fontSize="14" fontWeight="600" textAnchor="middle" style={{ fill: "#FFFFFF" }}>Board</text>
      <text x="1076.0" y="149" fontSize="14" fontWeight="600" textAnchor="middle" style={{ fill: "#6B5F78" }}>Table</text>
      <text x="1162.0" y="149" fontSize="14" fontWeight="600" textAnchor="middle" style={{ fill: "#6B5F78" }}>Timeline</text>
      <text x="1240.0" y="149" fontSize="14" fontWeight="600" textAnchor="middle" style={{ fill: "#6B5F78" }}>Map</text>
      <circle cx="1300" cy="144" r="16" fill={`url(#${p}tpeach)`} /><text x="1300" y="149" fontSize="13" fontWeight="600" textAnchor="middle">CA</text>
      <rect x="360" y="204" width="228" height="760" rx="14" fill="#FAF7FD" />
      <circle cx="380" cy="230" r="5" fill="#B9AEC4" /><text x="394" y="235" fontSize="15" fontWeight="600">Saved</text><text x="572" y="235" fontSize="14" textAnchor="end" className="l">3</text>
      <g filter={`url(#${p}cs)`}><rect x="370" y="254" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="384" y="270" width="32" height="32" rx="9" fill={`url(#${p}tbutter)`} /><text x="400" y="291" fontSize="15" fontWeight="600" textAnchor="middle">F</text>
      <text x="426" y="283" fontSize="14" fontWeight="600">Product Designer</text><text x="426" y="301" fontSize="13" className="m">Ferma</text>
      <text x="384" y="326" fontSize="12.5" className="l">Paris · Hybrid</text>
      <g filter={`url(#${p}cs)`}><rect x="370" y="350" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="384" y="366" width="32" height="32" rx="9" fill={`url(#${p}tblue)`} /><text x="400" y="387" fontSize="15" fontWeight="600" textAnchor="middle">L</text>
      <text x="426" y="379" fontSize="14" fontWeight="600">UX Designer</text><text x="426" y="397" fontSize="13" className="m">Lumio</text>
      <text x="384" y="422" fontSize="12.5" className="l">Lyon · Remote</text>
      <g filter={`url(#${p}cs)`}><rect x="370" y="446" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="384" y="462" width="32" height="32" rx="9" fill={`url(#${p}tgreen)`} /><text x="400" y="483" fontSize="15" fontWeight="600" textAnchor="middle">O</text>
      <text x="426" y="475" fontSize="14" fontWeight="600">Design Lead</text><text x="426" y="493" fontSize="13" className="m">Orbe</text>
      <text x="384" y="518" fontSize="12.5" className="l">Paris · On-site</text>
      <rect x="604" y="204" width="228" height="760" rx="14" fill="#FAF7FD" />
      <circle cx="624" cy="230" r="5" fill="#8FB0F5" /><text x="638" y="235" fontSize="15" fontWeight="600">Applied</text><text x="816" y="235" fontSize="14" textAnchor="end" className="l">3</text>
      <g filter={`url(#${p}cs)`}><rect x="614" y="254" width="208" height="118" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="628" y="270" width="32" height="32" rx="9" fill={`url(#${p}tgreen)`} /><text x="644" y="291" fontSize="15" fontWeight="600" textAnchor="middle">K</text>
      <text x="670" y="283" fontSize="14" fontWeight="600">Senior Product Desi…</text><text x="670" y="301" fontSize="13" className="m">Kiwimo</text>
      <text x="628" y="326" fontSize="12.5" className="l">Paris · Hybrid</text>
      <rect x="628" y="338" width="129" height="24" rx="12" fill={`url(#${p}tgreen)`} /><text x="692.5" y="354" fontSize="12" fontWeight="600" textAnchor="middle">Follow up today</text>
      <g filter={`url(#${p}cs)`}><rect x="614" y="382" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="628" y="398" width="32" height="32" rx="9" fill={`url(#${p}tpink)`} /><text x="644" y="419" fontSize="15" fontWeight="600" textAnchor="middle">T</text>
      <text x="670" y="411" fontSize="14" fontWeight="600">Product Designer</text><text x="670" y="429" fontSize="13" className="m">Talma</text>
      <text x="628" y="454" fontSize="12.5" className="l">Nantes · Remote</text>
      <g filter={`url(#${p}cs)`}><rect x="614" y="478" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="628" y="494" width="32" height="32" rx="9" fill={`url(#${p}tpeach)`} /><text x="644" y="515" fontSize="15" fontWeight="600" textAnchor="middle">B</text>
      <text x="670" y="507" fontSize="14" fontWeight="600">UI Designer</text><text x="670" y="525" fontSize="13" className="m">Brisa</text>
      <text x="628" y="550" fontSize="12.5" className="l">Paris · Hybrid</text>
      <rect x="848" y="204" width="228" height="760" rx="14" fill="#FAF7FD" />
      <circle cx="868" cy="230" r="5" fill="#C9A4F2" /><text x="882" y="235" fontSize="15" fontWeight="600">Interview</text><text x="1060" y="235" fontSize="14" textAnchor="end" className="l">2</text>
      <g filter={`url(#${p}cs)`}><rect x="858" y="254" width="208" height="118" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="872" y="270" width="32" height="32" rx="9" fill={`url(#${p}tlilac)`} /><text x="888" y="291" fontSize="15" fontWeight="600" textAnchor="middle">M</text>
      <text x="914" y="283" fontSize="14" fontWeight="600">Design case</text><text x="914" y="301" fontSize="13" className="m">Maréa</text>
      <text x="872" y="326" fontSize="12.5" className="l">Thu 10:00 · Case study</text>
      <rect x="872" y="338" width="136" height="24" rx="12" fill={`url(#${p}tlilac)`} /><text x="940.0" y="354" fontSize="12" fontWeight="600" textAnchor="middle">Prep notes ready</text>
      <g filter={`url(#${p}cs)`}><rect x="858" y="382" width="208" height="86" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="872" y="398" width="32" height="32" rx="9" fill={`url(#${p}tblue)`} /><text x="888" y="419" fontSize="15" fontWeight="600" textAnchor="middle">N</text>
      <text x="914" y="411" fontSize="14" fontWeight="600">Lead Product Design…</text><text x="914" y="429" fontSize="13" className="m">Nimbalo</text>
      <text x="872" y="454" fontSize="12.5" className="l">Fri 14:30 · Final</text>
      <rect x="1092" y="204" width="228" height="760" rx="14" fill="#FAF7FD" />
      <circle cx="1112" cy="230" r="5" fill="#8CCB9A" /><text x="1126" y="235" fontSize="15" fontWeight="600">Offer</text><text x="1304" y="235" fontSize="14" textAnchor="end" className="l">1</text>
      <g filter={`url(#${p}cs)`}><rect x="1102" y="254" width="208" height="118" rx="12" fill="#FFFFFF" stroke="#ECE7F1" /></g>
      <rect x="1116" y="270" width="32" height="32" rx="9" fill={`url(#${p}tpink)`} /><text x="1132" y="291" fontSize="15" fontWeight="600" textAnchor="middle">S</text>
      <text x="1158" y="283" fontSize="14" fontWeight="600">Product Designer</text><text x="1158" y="301" fontSize="13" className="m">Solène</text>
      <text x="1116" y="326" fontSize="12.5" className="l">€58k · Paris</text>
      <rect x="1116" y="338" width="129" height="24" rx="12" fill={`url(#${p}tpink)`} /><text x="1180.5" y="354" fontSize="12" fontWeight="600" textAnchor="middle">Reply by Monday</text>
      </g></g>
    </svg>
  );
}
