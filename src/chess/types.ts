import { User } from 'src/users/users.schema';
import { Chess } from './chess.schema';

/**
 * - "p" for Pawn
 * - "n" for Knight
 * - "b" for Bishop
 * - "r" for Rook
 * - "q" for Queen
 * - "k" for King
 */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PromotionPiece = Extract<PieceType, 'n' | 'b' | 'r' | 'q'>;

/**
 * - "b" for Black
 * - "w" for White
 */
export type PieceColor = 'w' | 'b';

export type GameOverType =
  | 'checkmate'
  | 'draw'
  | 'insufficientMaterial'
  | 'stalemate'
  | 'threefoldRepetition';

export interface ComputedChess {
  whitePlayer: string | null;
  blackPlayer: string | null;
  winPlayer: string | null;
  creater: string;
  resultParty: GameOverType | null;
  isVersusAi: boolean;
  isPlaying: boolean;
}

export interface PopulateChess
  extends Omit<Chess, 'creater' | 'blackPlayer' | 'whitePlayer' | 'winPlayer'> {
  creater: User;
  blackPlayer: User;
  whitePlayer: User;
  winPlayer: User;
}
