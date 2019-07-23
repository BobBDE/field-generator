// type de case, vide ou un block
export type Square = 'empty' | 'block' | 'outside' | 'entry' | 'exit';

export interface Coord {
  x: number;
  y: number;
}

export interface Movement {
  startPos: Coord; // position de départ du mouvement
  direction: Coord; // direction du mouvement
  endPos: Coord; // position d'arrivée (peut être la même position que départ
  blockPos: Coord; // block qui a fait arrêter le mouvement
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

export interface BlockGeneratorPrediction {
  blocksCoord: Coord[]; // liste des position des blocks
  exitCoord: Coord;
}
