import { IsNotEmpty, Validate } from 'class-validator';
import { PieceColorCheck } from './validator';

type ChessColor = 'w' | 'b';

export class ChessCreateDto {
  @IsNotEmpty()
  @Validate(PieceColorCheck)
  colorCreater: ChessColor;

  isVersusAi: boolean;
  isPlaying: boolean;
}
