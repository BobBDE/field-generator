// type de case, vide ou un block
import {NeuralNetwork} from './NeuralNetwork';
import {Field} from './Field';

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

// champs nécéssaire pour les generateurs
export interface Generator {
  // réseau de neuronne
  brain: NeuralNetwork;
  // terrain généré
  fields: Field[];
  // score total des fields
  totalScore: number;
  // moyenne des scores
  averageScore: number;
  // fitness en probabilité
  fitness: number;

  // clear les tensor de tensorflow
  dispose();
}

// mode de génération
export type GeneratorMode = 'FIELD' | 'BLOCK';
