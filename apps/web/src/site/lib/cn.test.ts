import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cn } from './cn.ts';

// Every --text-*, --radius-* and --container-* token declared in site.css must be known to cn() (see lib/cn.ts),
// otherwise tailwind-merge drops or keeps the wrong classes.
const css = readFileSync(new URL('../site.css', import.meta.url), 'utf8');

function names(namespace: string): string[] {
  const found = new Set<string>();
  // `--text-display-xl--line-height` is the line height of `--text-display-xl`, not a token of its own.
  for (const m of css.matchAll(new RegExp(`^\\s*--${namespace}-([\\w-]+?)(?:--[\\w-]+)?\\s*:`, 'gm'))) found.add(m[1]);
  return [...found];
}

test('site.css declares the tokens this test reads', () => {
  assert.ok(names('text').includes('body'));
  assert.ok(names('radius').includes('card'));
  assert.ok(names('container').includes('page'));
});

for (const name of names('text')) {
  test(`text-${name} is a font size, not a colour`, () => {
    assert.equal(cn(`text-${name}`, 'text-stone-950'), `text-${name} text-stone-950`);
    assert.equal(cn('text-stone-950', `text-${name}`), `text-stone-950 text-${name}`);
    assert.equal(cn(`text-${name}`, 'text-lg'), 'text-lg');
  });
}

for (const name of names('radius')) {
  test(`rounded-${name} is a radius`, () => {
    assert.equal(cn(`rounded-${name}`, 'rounded-full'), 'rounded-full');
    assert.equal(cn('rounded-full', `rounded-${name}`), `rounded-${name}`);
  });
}

for (const name of names('container')) {
  test(`max-w-${name} is a max width`, () => {
    assert.equal(cn(`max-w-${name}`, 'max-w-lg'), 'max-w-lg');
  });
}

test('the spacing variables of the page rhythm merge like any spacing class', () => {
  assert.equal(cn('px-(--gutter)', 'px-2'), 'px-2');
  assert.equal(cn('py-(--section-md)', 'pt-4'), 'py-(--section-md) pt-4');
  assert.equal(cn('pt-4', 'py-(--section-md)'), 'py-(--section-md)');
  assert.equal(cn('pt-(--section-lg)', 'pt-4'), 'pt-4');
});
