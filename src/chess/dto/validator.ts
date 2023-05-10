import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const PIECE_COLORS = ['w', 'b'];

@ValidatorConstraint({ name: 'customText', async: false })
export class PieceColorCheck implements ValidatorConstraintInterface {
  validate(text: string) {
    return PIECE_COLORS.includes(text);
  }

  defaultMessage() {
    return "The field 'colorCreater' = ($value). The value should only be equal to 'w' or 'b'";
  }
}
