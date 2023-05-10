import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from '../users/users.schema';
import { GameOverType, PromotionPiece } from './types';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  },
})
export class Chess extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  creater: Types.ObjectId;

  @Prop({
    required: false,
    default: null,
    type: Types.ObjectId,
    ref: User.name,
  })
  whitePlayer: Types.ObjectId;

  @Prop({ required: false, default: null })
  fen: string;

  @Prop({ required: false, default: null })
  pgn: string;

  @Prop({
    required: false,
    default: null,
    type: Types.ObjectId,
    ref: User.name,
  })
  blackPlayer: Types.ObjectId;

  @Prop({
    required: false,
    default: null,
    type: Types.ObjectId,
    ref: User.name,
  })
  winPlayer: Types.ObjectId;

  @Prop({ required: false, default: null })
  resultParty: GameOverType | null;

  @Prop({ required: false, default: false })
  isVersusAi: boolean;

  @Prop({ required: false, default: false })
  isPlaying: boolean;

  @Prop({ required: false, default: false })
  isAutoPromotion: boolean;

  @Prop({ required: false, default: 'q' })
  autopromotionPiece: PromotionPiece;

  @Prop({ required: false, default: false })
  isColoredMoves: boolean;

  @Prop({ required: false, default: false })
  isConfirmSteps: boolean;

  @Prop({ required: false, default: false })
  isAudioOn: boolean;

  @Prop({ required: false, default: null })
  difficult: number;
}

export const ChessSchema = SchemaFactory.createForClass(Chess);
