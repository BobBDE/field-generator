import {Coord, Movement, Square} from '../model';


export abstract class AbstractField {
  // nombre de case du terrain en largeur
  public readonly width: number;
  // nombre de case du terrain en hauteur
  public readonly height: number;
  // position X de l'entre
  public readonly entryPosX: number;
  // position X de la sortie
  public readonly exitPosX: number;

  // terrain
  public field: Square[][];

  // score du field
  public score = 0;

  // true si le terrain est faisable
  public isDoable = false;

  protected allDirections: Coord[] = [{x: 0, y: 1}, {x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: -1}];

  protected constructor(width: number, height: number, entryPosX: number, exitPosX: number,
                        data: Square[][]) {
    this.width = width;
    this.height = height;
    this.entryPosX = entryPosX;
    this.exitPosX = exitPosX;

    this.field = data;
  }

  abstract calculateScore();

  // renvoie la nouvelle position pour un déplacement dans une direction
  // peut être la même case que le départ si le déplacement est impossible
  protected moveToDirection(position: Coord, direction: Coord): Movement {
    // on créer une copie de l'objet pour par modifier l'original
    const newPosition = {
      x: position.x,
      y: position.y
    };

    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y
    };

    // on vérifie qu'on dépasse par le carré et les case où on peut s'arreter sont :
    // une case vide, l'entrée ou la sortie
    while (this.field[nextPosition.y] != null &&
    (this.field[nextPosition.y][nextPosition.x] === 'empty' ||
      this.field[nextPosition.y][nextPosition.x] === 'entry' ||
      this.field[nextPosition.y][nextPosition.x] === 'exit')) {
      // on valide la nouvelle position
      newPosition.x = nextPosition.x;
      newPosition.y = nextPosition.y;

      // on met à jour la position a regarder
      nextPosition.x += direction.x;
      nextPosition.y += direction.y;
    }

    return {
      startPos: position,
      direction,
      endPos: newPosition,
      blockPos: nextPosition,
    };
  }


  // renvoie la distance entre une case et la sortie
  protected getDistanceToExit(position: Coord): number {
    return Math.abs(position.x - this.exitPosX) + Math.abs(position.y - (this.height + 1));
  }


  // compte le nombre de block
  protected countBlockInField(): number {
    let count = 0;
    for (const line of this.field) {
      for (const square of line) {
        if (square === 'block') {
          count++;
        }
      }
    }
    return count;
  }

  public getSquare(coord: Coord): Square {
    // si les coordonnées dépasse le field, on renvoi outside
    if (coord.x < 0 || coord.x >= this.width ||
      coord.y < 0 || coord.y >= this.field.length) {
      return 'outside';
    } else {
      return this.field[coord.y][coord.x];
    }
  }


  public displaySquare(y: number, x: number): string {
    const square: Square = this.field[y][x];
    if (square === 'block') {
      return 'X';
    } else {
      return '';
    }
  }

  public logInformation() {
    this.logField();
  }

  protected logField() {
    const xField: string[][] = [];
    for (const line of this.field) {
      const newLine: string[] = [];
      for (const square of line) {
        switch (square) {
          case 'empty':
            newLine.push('');
            break;
          case 'exit':
          case 'entry':
            newLine.push('E');
            break;
          default:
            newLine.push('X');
            break;
        }
      }
      xField.push(newLine);
    }

    console.table(xField);
  }
}
