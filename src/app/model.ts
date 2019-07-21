// type de case, vide ou un block
export type Square = 'empty' | 'block' | 'outside' | 'entry' | 'exit';

export interface Coord {
  x: number;
  y: number;
}

export interface Serie {
  name: string;
  series: SerieData[];
}

export interface SerieData {
  name: string;
  value: number;
  min?: number;
  max?: number;
}

