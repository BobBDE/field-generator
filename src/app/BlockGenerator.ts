import {Coord, Generator, Square} from './model';
import {NeuralNetwork} from './NeuralNetwork';
import {Field} from './Field';
import {Config} from './Config';
import {Helper} from './helper';


export class BlockGenerator implements Generator {
  // nombre de terrain qui sont généré par FieldGenerator
  private readonly generateNumber: number;
  // nombre de case du terrain en largeur
  private readonly width: number;
  // nombre de case du terrain en hauteur
  private readonly height: number;
  // nombre de block a mettre sur le terrain
  private readonly blockCount: number;

  // position X de l'entre
  private entryPosX: number;
  // position X de la sortie
  private exitPosX: number;

  averageScore = 0;
  brain: NeuralNetwork;
  fields: Field[] = [];
  fitness: number;
  totalScore = 0;

  constructor(brain ?: NeuralNetwork) {
    this.generateNumber = Config.fieldGenerationNumber;
    this.width = Config.fieldWidth;
    this.height = Config.fieldHeight;
    this.blockCount = Config.blockCountPerField;

    if (brain != null) {
      this.brain = brain.copy();
      this.mutate();
    } else {
      this.brain = new NeuralNetwork(5, Config.hiddenNodeCount, this.blockCount);
    }

    this.generateFields();
  }

  // génère X fields
  private generateFields() {
    for (let i = 0; i < this.generateNumber; i++) {
      this.fields.push(this.generateField(i));
    }

    // calcule de la moyenne
    this.averageScore = this.totalScore / this.generateNumber;
  }

  // génère un terrain
  private generateField(count: number): Field {
    // générer les portes aléatoirement sans avoir les 2 sur la même ligne
    // this.entryPosX = Helper.roundRandom(0, this.width);
    // this.exitPosX = Helper.roundRandom(0, this.width);
    // while (this.entryPosX === this.exitPosX) {
    //   this.exitPosX = Helper.roundRandom(0, this.width);
    // }
    this.entryPosX = Math.trunc(count / this.height);
    this.exitPosX = count % this.width;

    // on crée les entrée pour le réseaux de neuronne
    const inputs: number[] = [this.width, this.height, this.blockCount, this.entryPosX, this.exitPosX];

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


    for (const prediction of predictions) {
      const coord: Coord = this.convertBlockPosition(prediction);
      if (coord !== null) {
        // on met un block a la valeur données
        convertedPrediction[coord.y + 1][coord.x] = 'block';
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
    exitLine[this.exitPosX] = 'exit';
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

  dispose() {
    this.brain.dispose();
  }

  public mutate() {
    this.brain.mutate(0.2);
  }

}
