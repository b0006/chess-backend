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
