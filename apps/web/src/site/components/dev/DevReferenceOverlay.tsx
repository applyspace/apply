'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';

/**
 * The design reference (`public/dev/da-reference.png`, git-ignored) laid over the page, scaled to the viewport width
 * and pinned to the top of the document, to check alignment by eye. R shows or hides it, + and - (or the slider)
 * change its opacity. The state is kept in localStorage. Click-through, so the page stays usable underneath.
 */
const SRC = '/dev/da-reference.png';
const STORAGE_KEY = 'apply-site-dev-reference';
const STEP = 5;

type Settings = { on: boolean; opacity: number };

const DEFAULTS: Settings = { on: false, opacity: 50 };

const listeners = new Set<() => void>();
let fallback: string | null = null;

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? fallback;
  } catch {
    return fallback;
  }
}

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

function parse(raw: string | null): Settings {
  if (!raw) return DEFAULTS;
  try {
    const value = JSON.parse(raw) as Partial<Settings>;
    const opacity = Number(value.opacity);
    return { on: value.on === true, opacity: Number.isFinite(opacity) ? clamp(opacity) : DEFAULTS.opacity };
  } catch {
    return DEFAULTS;
  }
}

/** Applies a change to the latest stored settings, so the key handler never works from a stale copy. */
function update(change: (current: Settings) => Settings) {
  fallback = JSON.stringify(change(parse(read())));
  try {
    localStorage.setItem(STORAGE_KEY, fallback);
  } catch {
    // Storage unavailable (private mode): the settings last until the page is closed.
  }
  listeners.forEach((listener) => listener());
}

/** True when the key was meant for a field: text inputs, selects, editable elements, and custom elements (the toolbar). */
function isTyping(event: KeyboardEvent) {
  for (const node of event.composedPath()) {
    if (!(node instanceof HTMLElement)) continue;
    if (node instanceof HTMLInputElement && node.type === 'range') continue;
    if (node.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName) || node.tagName.includes('-')) return true;
  }
  return false;
}

function onKeyDown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event)) return;
  const key = event.key.toLowerCase();
  if (key === 'r') {
    if (!event.repeat) update((current) => ({ ...current, on: !current.on }));
  } else if (key === '+' || key === '=') {
    update((current) => (current.on ? { ...current, opacity: clamp(current.opacity + STEP) } : current));
  } else if (key === '-' || key === '_') {
    update((current) => (current.on ? { ...current, opacity: clamp(current.opacity - STEP) } : current));
  }
}

const imageLayer: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 2147483000,
};

const panel: CSSProperties = {
  position: 'fixed',
  left: 12,
  bottom: 12,
  zIndex: 2147483001,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px 10px',
  maxWidth: 'calc(100vw - 24px)',
  padding: '8px 10px',
  borderRadius: 8,
  background: 'rgba(20, 20, 20, 0.88)',
  color: '#fff',
  font: '12px/1 ui-monospace, SFMono-Regular, Menlo, monospace',
};

export function DevReferenceOverlay() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const [missing, setMissing] = useState(false);
  const { on, opacity } = parse(raw);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!on) return null;

  return (
    <>
      <div aria-hidden style={{ ...imageLayer, opacity: opacity / 100 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a raw screenshot at its natural ratio, no optimisation wanted */}
        <img
          src={SRC}
          alt=""
          draggable={false}
          onLoad={() => setMissing(false)}
          onError={() => setMissing(true)}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>
      <div role="group" aria-label="Design reference overlay" style={panel}>
        <span>Reference</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={opacity}
          aria-label="Reference opacity"
          onChange={(event) => update((current) => ({ ...current, opacity: clamp(Number(event.target.value)) }))}
          style={{ width: 120 }}
        />
        <output style={{ minWidth: '4ch' }}>{opacity}%</output>
        <span style={{ opacity: 0.65 }}>R hide · + / − opacity</span>
        {missing && <span style={{ flexBasis: '100%', color: '#ffb4b4' }}>No image at public/dev/da-reference.png</span>}
      </div>
    </>
  );
}
