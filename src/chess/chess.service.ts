import { Injectable } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Chess } from './chess.schema';
import { ChessCreateDto } from './dto/chess-create.dto';
import { User } from 'src/users/users.schema';

const computedParty = (party: Chess) => {
  const partyData = party.toJSON();
  return {
    ...partyData,
    creater: partyData.creater.username,
    blackPlayer: partyData.blackPlayer?.username || null,
    whitePlayer: partyData.whitePlayer?.username || null,
  };
};

@Injectable()
export class ChessService {
  constructor(@InjectModel(Chess.name) private chessModel: Model<Chess>) {}

  async findAll(
    data?: LeanDocument<Partial<Chess>>,
  ): Promise<LeanDocument<Chess[]>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const chessList = await this.chessModel.find(data).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  // TODO: написать нормальный тип
  async findAllByProfile(
    playerId: User,
    isPlaying = false,
  ): Promise<LeanDocument<any[]>> {
    const chessList = await this.chessModel
      .find({
        $or: [
          { isPlaying },
          { creater: playerId },
          { whitePlayer: playerId },
          { blackPlayer: playerId },
        ],
      })
      .populate('creater', 'username')
      .populate('blackPlayer', 'username')
      .populate('whitePlayer', 'username')
      .exec();

    return chessList.map(computedParty);
  }

  async findAllByCreater(createrId: User): Promise<LeanDocument<Chess[]>> {
    const chessList = await this.chessModel.find({ creater: createrId }).exec();
    return chessList.map((chess) => chess.toJSON());
  }

  // TODO: написать нормальный тип
  async findOneById(chessId: Types.ObjectId): Promise<LeanDocument<any>> {
    const chess = await this.chessModel
      .findOne({ _id: chessId })
      .populate('creater', 'username')
      .populate('blackPlayer', 'username')
      .populate('whitePlayer', 'username')
      .exec();
    return chess && computedParty(chess);
  }

  create(createrId: User, chessData: ChessCreateDto): Promise<Chess> {
    const data: Partial<LeanDocument<Chess>> = {
      ...chessData,
      creater: createrId,
      blackPlayer: chessData.colorCreater === 'b' ? createrId : undefined,
      whitePlayer: chessData.colorCreater === 'w' ? createrId : undefined,
    };

    return this.chessModel.create(data);
  }

  remove(chessId: Types.ObjectId): Promise<Chess> {
    return this.chessModel.findOneAndRemove({ _id: chessId }).exec();
  }
}
