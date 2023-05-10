import { Injectable, BadRequestException } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Chess } from './chess.schema';
import { ChessCreateDto } from './dto/chess-create.dto';
import { ChessUpdateDto } from './dto/chess-update.dto';
import { ComputedChess, PopulateChess } from './types';

const computedParty = (party: PopulateChess): ComputedChess => {
  const partyData = party.toJSON() as unknown as LeanDocument<PopulateChess>;
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
    playerId: Types.ObjectId,
    isPlaying = false,
  ): Promise<LeanDocument<ComputedChess[]>> {
    const chessList = (await this.chessModel
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
      .exec()) as unknown as PopulateChess[];

    return chessList.map(computedParty);
  }

  async findAllByCreater(
    createrId: Types.ObjectId,
  ): Promise<LeanDocument<Chess[]>> {
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

    // const chess = await this.chessModel
    //   .findOne({ _id: chessId })
    //   .populate('creater', 'username')
    //   .populate('blackPlayer', 'username')
    //   .populate('whitePlayer', 'username')
    //   .exec();

    const party = (await this.chessModel
      .findOne({ _id: chessId })
      .populate('creater', 'username')
      .populate('blackPlayer', 'username')
      .populate('whitePlayer', 'username')
      .exec()) as unknown as PopulateChess;

    if (!party) {
      throw new BadRequestException('Party was not found');
    }

    return computedParty(party);
  }

  create(createrId: Types.ObjectId, chessData: ChessCreateDto): Promise<Chess> {
    console.log('createrId', createrId);
    const data: Partial<LeanDocument<Chess>> = {
      ...chessData,
      creater: createrId,
      blackPlayer: chessData.colorCreater === 'b' ? createrId : undefined,
      whitePlayer: chessData.colorCreater === 'w' ? createrId : undefined,
    };

    return this.chessModel.create(data);
  }

  // TODO: remove any type
  update(chessId: Types.ObjectId, chessData: ChessUpdateDto): any {
    const isValidId = Types.ObjectId.isValid(chessId);

    if (!isValidId) {
      throw new BadRequestException('Party ID is not valid');
    }

    return this.chessModel.updateOne(
      { _id: chessId },
      {
        winPlayer: chessData.winPlayer,
      },
    );
  }

  remove(chessId: Types.ObjectId): Promise<Chess> {
    return this.chessModel
      .findOneAndDelete({ _id: chessId }, { useFindAndModify: true })
      .exec();
  }
}
