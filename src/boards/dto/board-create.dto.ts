import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class BoardCreateDto {
  @IsNotEmpty()
  title: string;

  authorId: Types.ObjectId;
}
