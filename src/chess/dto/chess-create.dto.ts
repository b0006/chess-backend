import { IsNotEmpty, Validate } from 'class-validator';
import { PieceColor } from '../types';
import { PieceColorCheck } from './validator';

export class ChessCreateDto {
  @IsNotEmpty()
  @Validate(PieceColorCheck)
  colorCreater: PieceColor;

  isVersusAi: boolean;
  isPlaying: boolean;
}
