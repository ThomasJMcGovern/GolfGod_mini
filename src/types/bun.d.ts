declare module "bun:test" {
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function describe(name: string, fn: () => void): void;
  export function expect<T>(actual: T): {
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toBeCloseTo(expected: number, precision?: number): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeNull(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(expected: any): void;
    toThrow(expected?: string | RegExp | Error): void;
    toHaveLength(expected: number): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    not: {
      toBe(expected: T): void;
      toEqual(expected: T): void;
      toBeCloseTo(expected: number, precision?: number): void;
      toBeDefined(): void;
      toBeUndefined(): void;
      toBeNull(): void;
      toBeTruthy(): void;
      toBeFalsy(): void;
      toContain(expected: any): void;
      toThrow(expected?: string | RegExp | Error): void;
      toHaveLength(expected: number): void;
      toBeGreaterThan(expected: number): void;
      toBeLessThan(expected: number): void;
      toBeGreaterThanOrEqual(expected: number): void;
      toBeLessThanOrEqual(expected: number): void;
    };
  };
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
}