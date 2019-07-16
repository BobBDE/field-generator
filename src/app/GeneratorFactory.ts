import {Generator, GeneratorMode} from './model';
import {NeuralNetwork} from './NeuralNetwork';
import {FieldGenerator} from './FieldGenerator';
import {BlockGenerator} from './BlockGenerator';

// class pour créer les générateurs
export class GeneratorFactory {

  public static createGenerator(mode: GeneratorMode, previousBrain ?: NeuralNetwork): Generator {
    switch (mode) {
      case 'FIELD':
        return new FieldGenerator(previousBrain);
      case 'BLOCK':
        return new BlockGenerator(previousBrain);
    }
  }
}
