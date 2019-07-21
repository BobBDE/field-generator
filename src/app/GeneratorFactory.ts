import {NeuralNetwork} from './NeuralNetwork';
import {FieldGenerator} from './generator/FieldGenerator';
import {BlockGenerator} from './generator/BlockGenerator';
import {AbstractGenerator} from './generator/AbstractGenerator';
import {GeneratorMode} from './generator/generator.class';

// class pour créer les générateurs
export class GeneratorFactory {

  public static createGenerator(mode: GeneratorMode, previousBrain ?: NeuralNetwork): AbstractGenerator {
    switch (mode) {
      case 'FIELD':
        return new FieldGenerator(previousBrain);
      case 'BLOCK':
        return new BlockGenerator(previousBrain);
    }
  }
}
