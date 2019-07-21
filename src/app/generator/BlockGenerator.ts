import {Coord, Square} from '../model';
import {NeuralNetwork} from '../NeuralNetwork';
import {Field} from '../field/Field';
import {Config} from '../Config';
import {AbstractGenerator} from './AbstractGenerator';


export class BlockGenerator extends AbstractGenerator {

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
  protected generateField(count: number): Field {
    // générer les portes aléatoirement sans avoir les 2 sur la même ligne
    // this.entryPosX = Helper.roundRandom(0, this.width);
    // this.exitPosX = Helper.roundRandom(0, this.width);
    // while (this.entryPosX === this.exitPosX) {
    //   this.exitPosX = Helper.roundRandom(0, this.width);
    // }
    this.entryPosX = Math.trunc(count / this.height);
    // this.exitPosX = count % this.width;

    // on crée les entrée pour le réseaux de neuronne
    const inputs: number[] = [this.width, this.height, this.entryPosX];

    // on génère les output du réseaux
    const result = this.brain.predict(inputs);

    // on les converti en données Square
    const data: Square[][] = this.convertPrediction(result);

    // on génère un terrain
    const newField = new Field(this.width, this.height, this.entryPosX, this.exitPosX, data);

    // calcule directement le score pour cette génération de terrain
    // on l'ajoute au score actuel
    this.totalScore += newField.score;

    return newField;
  }

  // converti la prediction en un tableau de tableau
  private convertPrediction(predictions: number[]): Square[][] {
    predictions = Array.from(predictions);
    // console.log(predictions)

    // on ajoute automatiquement les non block devant les entrées sorties
    // predictions.splice(this.entryPosX, 0, -2);
    // const beforeExitPost = ((this.height - 1) * this.width) + this.exitPosX;
    // predictions.splice(beforeExitPost, 0, -2);

    const convertedPrediction: Square[][] = this.initField();


    for (let i = 0; i < predictions.length; i++) {
      if (i < predictions.length - 1) {
        const coord: Coord = this.convertBlockPosition(predictions[i]);
        if (coord !== null) {
          // on met un block a la valeur données
          convertedPrediction[coord.y + 1][coord.x] = 'block';
        }
      }
      // la dernière valeur est la position de la sortie
      else {
        this.exitPosX = this.convertExitPosition(predictions[i]);
        convertedPrediction[convertedPrediction.length - 1][this.exitPosX] = 'exit';
      }
    }

    return convertedPrediction;
  }

  // on initialise la ligne de l'entrée et la ligne de sortie et tout le reste à vide
  private initField(): Square[][] {
    const field: Square[][] = [];

    // on ajoute la ligne pour l'entrée
    const entryLine = Array(this.width).fill('outside');
    // on ajoute l'entrée
    entryLine[this.entryPosX] = 'entry';
    field.push(entryLine);


    // on ajoute ligne par ligne
    for (let i = 0; i < this.height; i++) {

      const line: Square[] = [];
      for (let j = 0; j < this.width; j++) {
        line.push('empty');
      }

      field.push(line);
    }

    // on ajoute la ligne pour la sortie
    const exitLine: Square[] = Array(this.width).fill('outside');
    // on ajoute l'entrée
    // exitLine[this.exitPosX] = 'exit';
    field.push(exitLine);

    return field;
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

}
