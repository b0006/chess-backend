import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PieceColor } from '../types';

const PIECE_COLORS: PieceColor[] = ['w', 'b'];

@ValidatorConstraint({ name: 'customText', async: false })
export class PieceColorCheck implements ValidatorConstraintInterface {
  validate(text: string) {
    return PIECE_COLORS.includes(text as PieceColor);
  }

  defaultMessage() {
    return "The field 'colorCreater' = ($value). The value should only be equal to 'w' or 'b'";
  }
}
