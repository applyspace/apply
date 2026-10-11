/**
 * Minimal `expect` on top of `node:assert`, so the tests run with `node --test` like the rest of
 * the repo (no test framework dependency). Only the matchers these tests use. Like Vitest,
 * `toEqual` ignores keys whose value is `undefined` and `toMatchObject` checks a recursive subset.
 */
import assert from 'node:assert/strict';
import { describe, it as nodeIt } from 'node:test';
import { inspect, isDeepStrictEqual } from 'node:util';

export { describe };

type TestFn = () => void | Promise<void>;

function format(template: string, args: readonly unknown[]): string {
  let i = 0;
  return template.replace(/%[sdio]/g, () => String(args[i++]));
}

/** `it` with Vitest's `it.each(rows)(name, fn)`: one test per row, `%s` replaced by the row values. */
export const it = Object.assign((name: string, fn: TestFn) => nodeIt(name, fn), {
  each:
    <Row extends readonly unknown[]>(rows: readonly Row[]) =>
    (name: string, fn: (...args: Row) => void | Promise<void>) => {
      for (const row of rows) nodeIt(format(name, row), () => fn(...row));
    },
});

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Drops `undefined` object values, recursively, as Vitest's `toEqual` does. */
function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) if (v !== undefined) out[k] = clean(v);
    return out;
  }
  return value;
}

function matchesSubset(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      expected.every((e, i) => matchesSubset(actual[i], e))
    );
  }
  if (expected !== null && typeof expected === 'object' && !(expected instanceof RegExp)) {
    if (actual === null || typeof actual !== 'object') return false;
    const a = actual as Record<string, unknown>;
    return Object.entries(expected).every(([k, v]) => matchesSubset(a[k], v));
  }
  return isDeepStrictEqual(actual, expected);
}

function show(value: unknown): string {
  return inspect(value, { depth: 6, breakLength: 100 });
}

interface Matchers {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toMatchObject(expected: object): void;
  toContain(item: unknown): void;
  toHaveLength(length: number): void;
  toHaveProperty(key: string): void;
  toMatch(pattern: RegExp | string): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toThrow(pattern?: RegExp): void;
}

function matchers(actual: unknown, negate: boolean, label?: string): Matchers {
  const check = (pass: boolean, message: string) => {
    if (pass !== negate) return;
    const text = negate ? `not: ${message}` : message;
    assert.fail(label ? `${label}: ${text}` : text);
  };
  return {
    toBe: (expected) => check(Object.is(actual, expected), `expected ${show(actual)} to be ${show(expected)}`),
    toEqual: (expected) =>
      check(isDeepStrictEqual(clean(actual), clean(expected)), `expected ${show(actual)} to equal ${show(expected)}`),
    toMatchObject: (expected) =>
      check(matchesSubset(actual, expected), `expected ${show(actual)} to match ${show(expected)}`),
    toContain: (item) => {
      const pass =
        typeof actual === 'string'
          ? actual.includes(String(item))
          : Array.isArray(actual) && actual.some((a) => Object.is(a, item));
      check(pass, `expected ${show(actual)} to contain ${show(item)}`);
    },
    toHaveLength: (length) =>
      check((actual as { length?: number } | null)?.length === length, `expected ${show(actual)} to have length ${length}`),
    toHaveProperty: (key) =>
      check(actual !== null && typeof actual === 'object' && key in actual, `expected ${show(actual)} to have property ${key}`),
    toMatch: (pattern) => {
      const text = String(actual);
      const pass = typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
      check(pass, `expected ${show(actual)} to match ${String(pattern)}`);
    },
    toBeNull: () => check(actual === null, `expected ${show(actual)} to be null`),
    toBeUndefined: () => check(actual === undefined, `expected ${show(actual)} to be undefined`),
    toThrow: (pattern) => {
      let thrown: unknown;
      let didThrow = false;
      try {
        (actual as () => unknown)();
      } catch (error) {
        didThrow = true;
        thrown = error;
      }
      const message = thrown instanceof Error ? thrown.message : String(thrown);
      check(didThrow && (!pattern || pattern.test(message)), `expected function to throw ${pattern ? String(pattern) : ''}`);
    },
  };
}

/** `label` is printed with a failure, like Vitest's `expect(value, message)`. */
export function expect(actual: unknown, label?: string) {
  return Object.assign(matchers(actual, false, label), {
    not: matchers(actual, true, label),
    rejects: {
      async toMatchObject(expected: object) {
        try {
          await actual;
        } catch (error) {
          matchers(error, false, label).toMatchObject(expected);
          return;
        }
        assert.fail('expected the promise to reject, it resolved');
      },
    },
  });
}
