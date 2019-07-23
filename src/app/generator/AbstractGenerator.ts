// champs nécéssaire pour les generateurs
import {NeuralNetwork} from '../NeuralNetwork';
import {AbstractField} from '../field/AbstractField';
import {Config} from '../Config';
import {Square} from '../model';

export abstract class AbstractGenerator {
  // nombre de terrain qui sont généré par FieldGenerator
  protected readonly generateNumber: number;
  // nombre de case du terrain en largeur
  protected readonly width: number;
  // nombre de case du terrain en hauteur
  protected readonly height: number;
  // nombre de block a mettre sur le terrain
  protected readonly blockCount: number;

  // position X de l'entre
  protected entryPosX: number;
  // position X de la sortie
  protected exitPosX: number;


  // réseaux de neuronne
  public brain: NeuralNetwork;
  // terrain
  public fields: AbstractField[] = [];

  // score du field
  public totalScore = 0;
  // moyenne des score
  public averageScore = 0;
  // fitness en probabilité
  public fitness;

  // génère un terrain
  protected abstract generateField(count: number): AbstractField;

  protected constructor() {
    this.generateNumber = Config.fieldGenerationNumber;
    this.width = Config.fieldWidth;
    this.height = Config.fieldHeight;
    this.blockCount = Config.blockCountPerField;
  }

  // génère X fields
  protected generateFields() {
    for (let i = 0; i < this.generateNumber; i++) {
      this.fields.push(this.generateField(i));
    }

    // calcule de la moyenne
    this.averageScore = this.totalScore / this.generateNumber;
  }

  // clear les tensor de tensorflow
  public dispose() {
    this.brain.dispose();
  }

  public mutate() {
    this.brain.mutate(0.2);
  }

  // on initialise la ligne de l'entrée et la ligne de sortie et tout le reste à vide
  protected initField(): Square[][] {
    const field: Square[][] = [];

    // on ajoute la ligne pour l'entrée
    const entryLine = Array(this.width).fill('outside');
    // on ajoute l'entrée
    if (this.entryPosX != null) {
      entryLine[this.entryPosX] = 'entry';
    }
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
    if (this.exitPosX != null) {
      exitLine[this.exitPosX] = 'exit';
    }
    field.push(exitLine);

    return field;
  }
}


