import {AbstractField} from './AbstractField';
import {Square} from '../model';


export class BlockField extends AbstractField {

  constructor(width: number, height: number, entryPosX: number, exitPosX: number,
              data: Square[][]) {
    super(width, height, entryPosX, exitPosX, data);
  }

  calculateScore() {

  }


}
