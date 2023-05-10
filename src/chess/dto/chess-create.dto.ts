import { IsNotEmpty, Validate } from 'class-validator';
import { PieceColor, PromotionPiece } from '../types';
import { PieceColorCheck } from './validator';

export class ChessCreateDto {
  @IsNotEmpty()
  @Validate(PieceColorCheck)
  colorCreater: PieceColor;

  isVersusAi: boolean;
  isPlaying: boolean;
  fen: string;
  pgn: string;
  isAutoPromotion: boolean;
  autopromotionPiece: PromotionPiece;
  isColoredMoves: boolean;
  isConfirmSteps: boolean;
  isAudioOn: boolean;
  difficult: number;
}
