import {Coord, Square} from './model';


export class Field {

  // nombre de case du terrain en largeur
  public width = 5;
  // nombre de case du terrain en hauteur
  public height = 5;
  // position X de l'entre
  public entryPosX = 1;
  // position X de la sortie
  public exitPosX = 3;

  // terrain
  public field: Square[][];

  // score du field
  public score = 0;

  // détail du score par case
  public scoreField: number[][];

  constructor(width: number, height: number, entryPosX: number, exitPosX: number,
              data: Square[][]) {
    this.width = width;
    this.height = height;
    this.entryPosX = entryPosX;
    this.exitPosX = exitPosX;

    this.field = data;

    this.calculateScore();
  }


  ///////////////////////////// CALCUL DU SCORE //////////////////////////////////

  // calcule le score du terrain généré
  public calculateScore() {
    // on créer une tableau de la même taile que la prediction avec des -1 partout
    // cela permet de savoir quels case on a deja visité
    this.scoreField = [];
    for (let i = 0; i < this.height + 2; i++) {
      this.scoreField.push(Array(this.width).fill(-1));
    }

    const entryPosition: Coord = {
      x: this.entryPosX,
      y: 0
    };

    const direction: Coord = {
      x: 0,
      y: 1
    };


    // on calcule la distance du départ
    // c'est la pire ditance qu'on puisse faire
    const startDistance = this.setPositionScore(entryPosition);

    // on récupère la distance la plus petite qu'on a pu faire de la sortie
    const shortestDistance = this.moveAndCheckScore(entryPosition, direction, startDistance);

    // la plus grand distance entre 2 portes.
    // Ne prend pas en compte la position des porte actuel pour ne pas prévilégier le score
    // en fonction de la position des porte de départ
    const bigestDistance = this.width + this.height;

    // if (this.countBlockInField() !== 4) {
    //   this.score = 0;
    //   return;
    // }

    // si la distance est de 0 --> le terrain est faisable
    if (shortestDistance === 0) {
      // on augmente le score de 5
      this.score = bigestDistance + 5;
    }
    // si la plus petit distance est égale a la distance de départ on met un score de 0
    // concretement un block a été placé devant l'entré
    else if (shortestDistance === startDistance) {
      this.score = 0;
    } else {
      // on compare la distance de départ et la plus petit pour avoir le meilleur score lorsqu'on s'approche
      this.score = bigestDistance - shortestDistance;
    }
  }

  // fonction recurcive pour bouger et trouve le meilleur score
  // le score le plus petit est le meilleur score
  private moveAndCheckScore(position: Coord, direction: Coord, bestDistance: number): number {
    const newPosition = this.moveToDirection(position, direction);

    // si c'est une case qu'on a déja visité on arrète
    if (this.scoreField[newPosition.y][newPosition.x] !== -1) {
      return bestDistance;
    }

    // on marque la case avec le score
    const currentScore = this.setPositionScore(newPosition);

    // si on est sur la fin
    if (currentScore === 0) {
      return currentScore;
    }

    if (currentScore < bestDistance) {
      bestDistance = currentScore;
    }


    // on essaye de se déplacer dans les 4 directions
    const directions: Coord[] = [{x: 0, y: 1}, {x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: -1}];
    for (const newDirection of directions) {
      bestDistance = this.moveAndCheckScore(newPosition, newDirection, bestDistance);
      if (bestDistance === 0) {
        return 0;
      }
    }

    return bestDistance;
  }


  // renvoie la nouvelle position pour un déplacement dans une direction
  // peut être la même case que le départ si le déplacement est impossible
  private moveToDirection(position: Coord, direction: Coord): Coord {
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

    return newPosition;
  }

  // on set le score pour une position dépendant de la distance à la sortie
  private setPositionScore(position: Coord): number {
    const distance = this.getDistanceToExit(position);
    this.scoreField[position.y][position.x] = distance;
    return distance;
  }

  // renvoie la distance entre une case et la sortie
  private getDistanceToExit(position: Coord): number {
    return Math.abs(position.x - this.exitPosX) + Math.abs(position.y - (this.height + 1));
  }

  // compte le nombre de block
  private countBlockInField(): number {
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


  private logScoreField() {
    for (const line of this.scoreField) {
      console.log(line);
    }
  }

  private logField() {
    for (const line of this.scoreField) {
      console.log(line);
    }
  }
}
