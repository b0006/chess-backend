import { IsNotEmpty } from 'class-validator';

type ChessColor = 'w' | 'b';

export class ChessCreateDto {
  @IsNotEmpty()
  colorCreater: ChessColor;

  isVersusAi: boolean;
  isPlaying: boolean;
}
