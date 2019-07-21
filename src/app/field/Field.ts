import {Coord, Square} from '../model';
import {AbstractField} from './AbstractField';


export class Field extends AbstractField{
  // détail du score par case
  public scoreField: number[][];

  constructor(width: number, height: number, entryPosX: number, exitPosX: number,
              data: Square[][]) {
    super(width, height, entryPosX, exitPosX, data);
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
      this.isDoable = true;
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


// on set le score pour une position dépendant de la distance à la sortie
  private setPositionScore(position: Coord): number {
    const distance = this.getDistanceToExit(position);
    this.scoreField[position.y][position.x] = distance;
    return distance;
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
