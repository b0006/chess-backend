import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BoardDeleteDto {
  @IsNotEmpty()
  id: Types.ObjectId;
}
