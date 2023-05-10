import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { GameOverType } from '../types';

export class ChessUpdateDto {
  @IsNotEmpty()
  winPlayer: Types.ObjectId;

  @IsNotEmpty()
  resultParty: GameOverType;

  @IsNotEmpty()
  isPlaying: boolean;
}
