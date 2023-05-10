import { IsNotEmpty } from 'class-validator';
import { GameOverType } from '../types';

export class ChessUpdateDto {
  @IsNotEmpty()
  winPlayer: string;

  @IsNotEmpty()
  resultParty: GameOverType;

  @IsNotEmpty()
  isPlaying: boolean;

  fen: string;

  pgn: string;
}
