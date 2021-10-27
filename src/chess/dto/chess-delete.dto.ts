import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ChessDeleteDto {
  @IsNotEmpty()
  id: Types.ObjectId;
}
