import { Injectable } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Chess } from './chess.schema';
import { ChessCreateDto } from './dto/chess-create.dto';
import { User } from 'src/users/users.schema';

@Injectable()
export class ChessService {
  constructor(@InjectModel(Chess.name) private chessModel: Model<Chess>) {}

  async findAll(
    data?: LeanDocument<Partial<Chess>>,
  ): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel.find(data).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  async findAllByProfile(playerId: User): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel
      .find({
        $or: [
          { creater: playerId },
          { whitePlayer: playerId },
          { blackPlayer: playerId },
        ],
      })
      .exec();

    return chessList.map((chess) => chess.toJSON());
  }

  async findAllByCreater(createrId: User): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel.find({ creater: createrId }).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  async findOneById(chessId: Types.ObjectId): Promise<LeanDocument<Chess>> {
    const chess = await this.chessModel.findOne({ _id: chessId }).exec();
    return chess?.toJSON();
  }

  create(createrId: User, chessData: ChessCreateDto): Promise<Chess> {
    const data: Partial<LeanDocument<Chess>> = {
      ...chessData,
      creater: createrId,
      blackPlayer: chessData.colorCreater === 'b' && createrId,
      whitePlayer: chessData.colorCreater === 'w' && createrId,
    };

    return this.chessModel.create(data);
  }

  remove(chessId: Types.ObjectId): Promise<Chess> {
    return this.chessModel.findOneAndRemove({ _id: chessId }).exec();
  }
}
