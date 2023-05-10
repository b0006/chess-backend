import { User } from 'src/users/users.schema';
import { Chess } from './chess.schema';

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
