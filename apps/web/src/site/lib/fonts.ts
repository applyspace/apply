import localFont from 'next/font/local';

/*
 * Website fonts, self-hosted from the npm packages already installed (geist, @fontsource-variable/fraunces; SIL OFL): the same families as Google Fonts, without a
 * network fetch at build time. Geist ships only SemiBold 600 and Bold 700 (every text is 600, art direction v3);
 * Fraunces is the italic variable font with its wght, opsz, SOFT and WONK axes, for titles.
 */
export const geist = localFont({
  src: [
    { path: '../../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const fraunces = localFont({
  src: [{ path: '../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2', weight: '100 900', style: 'italic' }],
  variable: '--font-fraunces',
  display: 'swap',
  fallback: ['ui-serif', 'Georgia', 'serif'],
});
