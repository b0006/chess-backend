import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { ChessController } from './chess.controller';
import { ChessService } from './chess.service';
import { Chess, ChessSchema } from './chess.schema';
import { ChessGateway } from './chess.gateway';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: Chess.name, schema: ChessSchema }])],
  providers: [ChessService, ChessGateway],
  controllers: [ChessController],
  exports: [ChessService],
})
export class ChessModule {}
