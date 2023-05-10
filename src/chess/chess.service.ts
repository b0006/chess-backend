import { Injectable, BadRequestException } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Chess } from './chess.schema';
import { ChessCreateDto } from './dto/chess-create.dto';
import { User } from 'src/users/users.schema';
import { ComputedChess } from './types';

const computedParty = (party: Chess): ComputedChess => {
  const partyData = party.toJSON();
  return {
    ...partyData,
    creater: partyData.creater.username,
    blackPlayer: partyData.blackPlayer?.username || null,
    whitePlayer: partyData.whitePlayer?.username || null,
    winPlayer: partyData.winPlayer?.username || null,
  };
};

@Injectable()
export class ChessService {
  constructor(@InjectModel(Chess.name) private chessModel: Model<Chess>) {}

  async findAllByProfile(
    playerId: User,
    isPlaying = false,
  ): Promise<LeanDocument<ComputedChess[]>> {
    const chessList: LeanDocument<Chess[]> = await this.chessModel
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

  async findOneById(
    chessId: Types.ObjectId,
  ): Promise<LeanDocument<ComputedChess>> {
    const isValidId = Types.ObjectId.isValid(chessId);

    if (!isValidId) {
      throw new BadRequestException('Party ID is not valid');
    }

    const chess = await this.chessModel
      .findOne({ _id: chessId })
      .populate('creater', 'username')
      .populate('blackPlayer', 'username')
      .populate('whitePlayer', 'username')
      .exec();

    if (!chess) {
      throw new BadRequestException('Party was not found');
    }

    return computedParty(chess);
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
    return this.chessModel
      .findOneAndDelete({ _id: chessId }, { useFindAndModify: true })
      .exec();
  }
}
