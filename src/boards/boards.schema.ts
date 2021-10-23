import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from '../users/users.schema';

@Schema({
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
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  titleTranspile: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  authorId: User;

  @Prop({ default: false })
  isPrivate: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
