import {NeuralNetwork} from './NeuralNetwork';
import {Coord, Square} from './model';

export class Field {

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

  private brain: NeuralNetwork;

  public field: Square[][];

  public total = 0;

  constructor() {
    this.brain = new NeuralNetwork(5, 50, this.width * this.height);

    this.generateField();
  }

  private generateField() {
    const inputs: number[] = [this.width, this.height, this.blockNumber, this.entryPosX, this.exitPosX];


    const result = this.brain.predict(inputs);

    this.field = this.convertPrediction(result);
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

        // on calcule le total
        this.total += value;
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
    if (value < 0) {
      return 'empty';
    } else {
      return 'block';
    }
  }

  // calcule le score du terrain généré
  public calculateScore(): number {
    // on créer une tableau de la même taile que la prediction avec des -1 partout
    // cela permet de savoir quels case on a deja visité
    const scoreField: number[][] = Array(this.height + 2).fill(Array(this.width).fill(-1));


  }


  // renvoie la nouvelle position pour un déplacement dans une direction
  // peut être la même case que le départ si le déplacement est impossible
  private moveToDirection(position: Coord, direction: Coord): Coord {
    const newPosition = position;

    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y
    };

    while (this.field[nextPosition.x] != null &&
    this.field[nextPosition.x][nextPosition.y] != null &&
    this.field[nextPosition.x][nextPosition.y] === 'empty') {
      newPosition.x += direction.x;
      newPosition.y += direction.y;
    }

    return newPosition;
  }

}
