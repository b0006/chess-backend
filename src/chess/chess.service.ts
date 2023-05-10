import { Injectable, BadRequestException } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UsersService } from '../users/users.service';
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
  constructor(
    @InjectModel(Chess.name) private chessModel: Model<Chess>,
    private usersService: UsersService,
  ) {}

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
      .populate('winPlayer', 'username')
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

    const party = (await this.chessModel
      .findOne({ _id: chessId })
      .populate('creater', 'username')
      .populate('winPlayer', 'username')
      .populate('blackPlayer', 'username')
      .populate('whitePlayer', 'username')
      .exec()) as unknown as PopulateChess;

    if (!party) {
      throw new BadRequestException('Party was not found');
    }

    return computedParty(party);
  }

  create(createrId: Types.ObjectId, chessData: ChessCreateDto): Promise<Chess> {
    const data: Partial<LeanDocument<Chess>> = {
      ...chessData,
      creater: createrId,
      blackPlayer: chessData.colorCreater === 'b' ? createrId : undefined,
      whitePlayer: chessData.colorCreater === 'w' ? createrId : undefined,
    };

    return this.chessModel.create(data);
  }

  async update(
    chessId: Types.ObjectId,
    chessData: ChessUpdateDto,
  ): Promise<{ status: boolean }> {
    const isValidId = Types.ObjectId.isValid(chessId);

    if (!isValidId) {
      throw new BadRequestException('Party ID is not valid');
    }

    const winPlayer = await this.usersService.findOneByUsername(
      chessData.winPlayer,
    );

    const updated = await this.chessModel.updateOne(
      { _id: chessId },
      {
        ...chessData,
        winPlayer: winPlayer?._id?.toString() || null,
      },
    );

    return { status: Boolean(updated.ok) };
  }

  remove(chessId: Types.ObjectId): Promise<Chess> {
    return this.chessModel
      .findOneAndDelete({ _id: chessId }, { useFindAndModify: true })
      .exec();
  }
}
