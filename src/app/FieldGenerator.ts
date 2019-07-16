import {NeuralNetwork} from './NeuralNetwork';
import {Generator, Square} from './model';
import {Field} from './Field';
import {Config} from './Config';
import {Helper} from './helper';

// classe qui permet de générer des field
export class FieldGenerator implements Generator {
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


  // réseaux de neuronne
  public brain: NeuralNetwork;
  // terrain
  public fields: Field[] = [];

  // score du field
  public totalScore = 0;
  // moyenne des score
  public averageScore = 0;
  // fitness en probabilité
  public fitness;


  constructor(brain ?: NeuralNetwork) {
    this.generateNumber = Config.fieldGenerationNumber;
    this.width = Config.fieldWidth;
    this.height = Config.fieldHeight;
    this.blockCount = Config.blockCountPerField;

    if (brain != null) {
      this.brain = brain.copy();

      this.mutate();
    } else {
      this.brain = new NeuralNetwork(5, Config.hiddenNodeCount, (this.width * this.height) - 2);
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
    this.entryPosX = Helper.roundRandom(0, this.width);
    this.exitPosX = Helper.roundRandom(0, this.width);
    while (this.entryPosX === this.exitPosX) {
      this.exitPosX = Helper.roundRandom(0, this.width);
    }
    // this.entryPosX = Math.trunc(count / this.height);
    // this.exitPosX = count % this.width;

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

    // on ajoute automatiquement les non block devant les entrées sorties
    predictions.splice(this.entryPosX, 0, -2);
    const beforeExitPost = ((this.height - 1) * this.width) + this.exitPosX;
    predictions.splice(beforeExitPost, 0, -2);

    const convertedPrediction: Square[][] = [];

    // on ajoute la ligne pour l'entrée
    const entryLine = Array(this.width).fill('outside');
    // on ajoute l'entrée
    entryLine[this.entryPosX] = 'entry';
    convertedPrediction.push(entryLine);


    // on ajoute ligne par ligne
    for (let i = 0; i < this.height; i++) {

      const line: Square[] = [];
      for (let j = 0; j < this.width; j++) {
        const value: number = predictions[(i * this.height) + j];
        line.push(this.convertValueToSquare(value));
      }

      convertedPrediction.push(line);
    }

    // on ajoute la ligne pour la sortie
    const exitLine: Square[] = Array(this.width).fill('outside');
    // on ajoute l'entrée
    exitLine[this.exitPosX] = 'exit';
    convertedPrediction.push(exitLine);

    return convertedPrediction;
  }

  private convertValueToSquare(value: number): Square {
    if (value < 0.5) {
      return 'empty';
    } else {
      return 'block';
    }
  }

  public dispose() {
    this.brain.dispose();
  }

  public mutate() {
    this.brain.mutate(0.2);
  }


}
