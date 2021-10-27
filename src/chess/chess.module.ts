import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChessController } from './chess.controller';
import { ChessService } from './chess.service';
import { Chess, ChessSchema } from './chess.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chess.name, schema: ChessSchema }]),
  ],
  providers: [ChessService],
  controllers: [ChessController],
  exports: [ChessService],
})
export class ChessModule {}
