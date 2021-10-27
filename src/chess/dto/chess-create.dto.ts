import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ChessCreateDto {
  @IsNotEmpty()
  creater: Types.ObjectId;

  whitePlayer: Types.ObjectId;
  blackPlayer: Types.ObjectId;

  isVersusAi: boolean;
  isPlaying: boolean;
}
