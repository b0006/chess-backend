import { GameOverType, PromotionPiece } from '../types';

export class ChessUpdateDto {
  winPlayer: string;
  resultParty: GameOverType;
  isPlaying: boolean;
  isVersusAi: boolean;
  fen: string;
  pgn: string;
  isAutoPromotion: boolean;
  autopromotionPiece: PromotionPiece;
  isColoredMoves: boolean;
  isConfirmSteps: boolean;
  isAudioOn: boolean;
  difficult: number;
}
