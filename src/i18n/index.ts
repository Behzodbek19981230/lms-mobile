import { uz } from './uz';

export type Strings = typeof uz;

export function t<K extends keyof Strings>(key: K): Strings[K] {
  return uz[key];
}

export { uz };
