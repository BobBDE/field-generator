// type de case, vide ou un block
export type Square = 'empty' | 'block' | 'outside' | 'entry' | 'exit';

export interface Coord {
  x: number;
  y: number;
}
