import {NeuralNetwork} from './NeuralNetwork';
import {Square} from './model';
import {Helper} from './helper';
import {Field} from './Field';

// classe qui permet de générer des field
export class FieldGenerator {
  // nombre de terrain qui sont généré par FieldGenerator
  public generateNumber = 1;

  // nombre de case du terrain en largeur
  public width = 5;
  // nombre de case du terrain en hauteur
  public height = 5;
  // nombre de block a mettre sur le terrain
  public blockNumber = 4;
  // position X de l'entre
  public entryPosX = 1;
  // position X de la sortie
  public exitPosX = 3;


  // réseaux de neuronne
  public brain: NeuralNetwork;
  // terrain
  public fields: Field[] = [];

  // score du field
  public totalScore = 0;
  // moyenne des score
  public scoreAverage = 0;
  // fitness en probabilité
  public probaFitness;


  constructor(brain ?: NeuralNetwork, score ?: number) {
    if (brain != null) {
      this.brain = brain.copy();

      if (score !== 0) {
        this.mutate();
      }
    } else {
      this.brain = new NeuralNetwork(5, 50, this.width * this.height);
    }

    this.generateFields();
  }

  // génère X fields
  private generateFields() {
    for (let i = 0; i < this.generateNumber; i++) {
      this.fields.push(this.generateField());
    }

    // calcule de la moyenne
    this.scoreAverage = this.totalScore / this.generateNumber;
  }

  // génère un terrain
  private generateField(): Field {
    // générer les portes aléatoirement sans avoir les 2 sur la même ligne
    this.entryPosX = Helper.roundRandom(0, 5);
    this.exitPosX = Helper.roundRandom(0, 5);
    while (this.entryPosX === this.exitPosX) {
      this.exitPosX = Helper.roundRandom(0, 5);
    }

    // on crée les entrée pour le réseaux de neuronne
    const inputs: number[] = [this.width, this.height, this.blockNumber, this.entryPosX, this.exitPosX];

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
