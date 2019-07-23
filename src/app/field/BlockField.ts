import {AbstractField} from './AbstractField';
import {BlockGeneratorPrediction, Coord, Movement, Square} from '../model';
import {Config} from '../Config';


export class BlockField extends AbstractField {

  private blocks: number[][];

  constructor(width: number, height: number, entryPosX: number, exitPosX: number,
              data: Square[][], private blockPosition: BlockGeneratorPrediction) {
    super(width, height, entryPosX, exitPosX, data);
  }


  calculateScore() {
    // on créer une tableau de la même taile que la prediction avec des -1 partout
    // cela permet de savoir quels case on a deja visité
    this.blocks = [];
    for (let i = 0; i < this.height + 2; i++) {
      this.blocks.push(Array(this.width).fill(-1));
    }

    this.calculateMove({
      x: this.entryPosX,
      y: 0
    });

    // this.score = 0;
    //
    // let previousMove = 0;
    // for (let i = 0; i < this.blockPosition.blocksCoord.length + 1; i++) {
    //   let coord: Coord;
    //   if (i === this.blockPosition.blocksCoord.length) {
    //     coord = this.blockPosition.exitCoord;
    //   } else {
    //     coord = this.blockPosition.blocksCoord[i];
    //   }
    //
    //   // si on touche le block suivant après le précédent ça fait un point
    //   if (this.blocks[coord.y][coord.x] > previousMove) {
    //     this.score++;
    //     previousMove = this.blocks[coord.y][coord.x];
    //   } else {
    //     break;
    //   }
    // }

    if (this.score === Config.blockCountPerField) {
      this.isDoable = true;
    }


  }

  // fonction recurcive pour bouger et trouve le meilleur score
  // le score le plus petit est le meilleur score
  private calculateMove(startPosition: Coord) {
    let move = 0;
    let nextPos: Coord[] = [];

    // initialise les valeurs
    nextPos.push(startPosition);
    this.blocks[startPosition.y][startPosition.x] = move;
    this.score = 0;

    while (nextPos.length > 0) {
      move++;

      // on passe aux movement d'après
      nextPos = this.calculateAllChildMoves(nextPos, move);
    }
  }

  // check tous les mouvement pour un numéros de move
  // et renvoie toute les nouvelles position
  private calculateAllChildMoves(positions: Coord[], move: number): Coord[] {
    let correctBlock: boolean = null;

    const newNextPos: Coord[] = [];
    for (const position of positions) {
      for (const newDirection of this.allDirections) {
        const movement: Movement = this.moveToDirection(position, newDirection);

        const newPosition: Coord = movement.endPos;
        // si on est arrivé sur une nouvelle case
        if (this.blocks[newPosition.y][newPosition.x] === -1) {
          // on marque la case comme vu pour le nombre de mouvement
          this.blocks[newPosition.y][newPosition.x] = move;

          // VERIFICATION SUR LE BLOCK
          const blockPosition: Coord = movement.blockPos;

          const blockSquare: Square = this.getSquare(blockPosition);

          // si la cause de l'arrêt est un block
          if (blockSquare === 'block') {

            const currentBlockNumber = this.findBlockNumber(blockPosition);
            // on regarde si on est arrêter sur le bon block dans l'ordre
            if (currentBlockNumber === this.score) {
              correctBlock = true;
              this.blocks[blockPosition.y][blockPosition.x] = move + 100;

              // on ajoute la position aux prochaines a tester
              newNextPos.push(movement.endPos);

            } else if (currentBlockNumber > this.score && !correctBlock) {
              // si on c'est arrété sur un futur block, on ne fait rien
              correctBlock = false;
            }
          } else {
            // on ajoute la position aux prochaines a tester
            newNextPos.push(movement.endPos);
          }
        }
      }
    }

    // si on est tombé sur aucun block ou qu'on est tombé sur le bon block
    if (correctBlock == null || correctBlock) {
      // si on c'est arreté sur le bon block, on informe
      if (correctBlock) {
        this.score++;
      }
      // on retourne les nouvelles position pour continuer
      return newNextPos;
    } else {
      // sinon on s'arrête
      return [];
    }

  }


  // on surchage le display pour afficher le numéro du block plutot qu'un X
  displaySquare(y: number, x: number): string {
    const square: Square = this.field[y][x];
    if (square === 'block') {
      return this.findBlockNumber({x, y}).toString();
    } else {
      return '';
    }
  }


  logInformation() {
    super.logInformation();

    console.table(this.blocks);

    console.log(this.blockPosition);
  }

// retourne le numéro du block en fonction de sa position
  private findBlockNumber(coord: Coord): number {
    let i = 0;
    for (const block of this.blockPosition.blocksCoord) {
      if (block.x === coord.x && block.y === coord.y) {
        return i;
      }
      i++;
    }
    return -1;
  }
}
