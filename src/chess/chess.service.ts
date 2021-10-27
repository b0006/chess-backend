import { Injectable } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Chess } from './chess.schema';
import { ChessCreateDto } from './dto/chess-create.dto';

@Injectable()
export class ChessService {
  constructor(@InjectModel(Chess.name) private chessModel: Model<Chess>) {}

  async findAll(
    data?: LeanDocument<Partial<Chess>>,
  ): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel.find(data).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  async findAllByCreater(
    // TODO: установить корректный тип
    createrId: any,
  ): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel.find({ creater: createrId }).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  async findOneById(chessId: Types.ObjectId): Promise<LeanDocument<Chess>> {
    const chess = await this.chessModel.findOne({ _id: chessId }).exec();
    return chess?.toJSON();
  }

  create(chessData: ChessCreateDto): Promise<Chess> {
    // const titleTranspile = transpileTitle(boardData.title);
    return this.chessModel.create(chessData);
  }

  remove(chessId: Types.ObjectId): Promise<Chess> {
    return this.chessModel.findOneAndRemove({ _id: chessId }).exec();
  }
}
