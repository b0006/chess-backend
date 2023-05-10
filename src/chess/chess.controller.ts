import {
  Controller,
  Request,
  Get,
  Delete,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ChessService } from './chess.service';
import { ChessCreateDto } from './dto/chess-create.dto';
import { ChessDeleteDto } from './dto/chess-delete.dto';
import { ChessUpdateDto } from './dto/chess-update.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/chess')
export class ChessController {
  constructor(private chessService: ChessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req, @Body() body: ChessCreateDto) {
    const created = await this.chessService.create(req.user.id, body);
    if (!created) {
      throw new BadRequestException('Error. Party was not created');
    }

    return this.chessService.findOneById(created._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async findByProfile(@Request() req) {
    const chessList = await this.chessService.findAllByProfile(req.user.id);
    return chessList;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  async remove(@Request() req, @Body() body: ChessDeleteDto) {
    const chessId = body.id;

    const chess = await this.chessService.findOneById(chessId);
    if (!chess) {
      throw new NotFoundException('The party is not found for delete');
    }

    if (chess.creater !== req.user?.username) {
      throw new BadRequestException(
        'It is forbidden to delete non-your parties',
      );
    }

    const deleted = await this.chessService.remove(chessId);
    if (!deleted) {
      throw new NotFoundException('The party was not removed. Try again');
    }
    return { status: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOne(@Request() req) {
    const chess = await this.chessService.findOneById(req.params.id);
    if (!chess) {
      throw new BadRequestException('Error. The party was not found');
    }

    return chess;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async update(@Request() req, @Body() body: ChessUpdateDto) {
    const chess = await this.chessService.update(req.params.id, body);

    if (!chess) {
      throw new BadRequestException('Error. The party was not updated');
    }

    return chess;
  }
}
