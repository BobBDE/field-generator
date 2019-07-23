import {BlockGeneratorPrediction, Coord, Square} from '../model';
import {NeuralNetwork} from '../NeuralNetwork';
import {Config} from '../Config';
import {AbstractGenerator} from './AbstractGenerator';
import {BlockField} from '../field/BlockField';
import {AbstractField} from '../field/AbstractField';


export class BlockGenerator extends AbstractGenerator {

  private readonly maxSize: number = 20;

  constructor(brain ?: NeuralNetwork) {
    super();

    // on construit le cerveau
    if (brain != null) {
      this.brain = brain.copy();
      this.mutate();
    } else {
      this.brain = new NeuralNetwork(3, Config.hiddenNodeCount, this.blockCount);
    }

    this.generateFields();
  }


  // génère un terrain
  protected generateField(count: number): AbstractField {
    // générer les portes aléatoirement sans avoir les 2 sur la même ligne
    // this.entryPosX = Helper.roundRandom(0, this.width);
    // this.exitPosX = Helper.roundRandom(0, this.width);
    // while (this.entryPosX === this.exitPosX) {
    //   this.exitPosX = Helper.roundRandom(0, this.width);
    // }
    this.entryPosX = Math.trunc(count / this.height);
    // this.exitPosX = count % this.width;

    // on crée les entrée pour le réseaux de neuronne
    const inputs: number[] = [this.width / this.maxSize, this.height / this.maxSize, this.entryPosX / this.width];

    // on génère les output du réseaux
    const result = this.brain.predict(inputs);

    // on les converti en position de block et de sortie
    const predictions: BlockGeneratorPrediction = this.convertPredictionToCoords(result);
    this.exitPosX = predictions.exitCoord.x;

    // on génère le field
    const field: Square[][] = this.generateSquare(predictions);

    // on génère un terrain
    const newField = new BlockField(this.width, this.height, this.entryPosX, this.exitPosX, field, predictions);
    newField.calculateScore();



    // calcule directement le score pour cette génération de terrain
    // on l'ajoute au score actuel
    this.totalScore += newField.score;

    return newField;
  }

  // converti la prediction en un tableau de tableau
  private convertPredictionToCoords(predictions: number[]): BlockGeneratorPrediction {
    predictions = Array.from(predictions);

    const convertedPredictions: BlockGeneratorPrediction = {
      blocksCoord: [],
      exitCoord: null
    };

    for (let i = 0; i < predictions.length; i++) {
      if (i < predictions.length - 1) {
        convertedPredictions.blocksCoord.push(this.convertBlockPosition(predictions[i]));
      }
      // la dernière valeur est la position de la sortie
      else {
        convertedPredictions.exitCoord = {
          x: this.convertExitPosition(predictions[i]),
          y: this.height - 1
        };
      }
    }

    return convertedPredictions;
  }

  // converti la position des block
  private convertBlockPosition(value: number): Coord {
    // on passe la valeur entre 0 et 2
    let convertValue = value;

    if (convertValue < 0 || convertValue > 2) {
      console.error('Value pas cool');
      return null;
    }

    // convertir la valeur entre 0 et 2 vers une valeur entre 0 et 24 compris
    convertValue = Math.trunc(convertValue * this.width * this.height);

    // converti ça en coordonnée
    return {
      x: convertValue % this.width,
      y: Math.trunc(convertValue / this.height)
    };
  }

  // converti la position de la sortie
  private convertExitPosition(value: number): number {
    // on passe la valeur entre 0 et 2
    let convertValue = value;

    if (convertValue < 0 || convertValue > 2) {
      console.error('Value pas cool');
      return null;
    }

    // convertir la valeur entre 0 et 2 vers une valeur entre 0 et la largeur compris
    convertValue = Math.trunc(convertValue * this.width);

    return convertValue;
  }

  private generateSquare(prediction: BlockGeneratorPrediction): Square[][] {

    const field: Square[][] = this.initField();

    // on ajoute les block
    for (const blockCoord of prediction.blocksCoord) {
      field[blockCoord.y][blockCoord.x] = 'block';
    }
    return field;
  }
}
