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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/chess')
export class ChessController {
  constructor(private chessService: ChessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req, @Body() body: ChessCreateDto) {
    const created = await this.chessService.create(req.user.id, body);
    if (!created) {
      throw new BadRequestException('Ошибка. Партия не была создана');
    }

    return this.chessService.findOneById(created._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
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
      throw new NotFoundException('Партия не найдена для удаления');
    }

    if (chess.creater !== req.user?.username) {
      throw new BadRequestException('Запрещено удалять чужие партии');
    }

    const deleted = await this.chessService.remove(chessId);
    if (!deleted) {
      throw new NotFoundException(
        'Партия не была удалена. Попробуйте повторить попытку',
      );
    }
    return { status: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findOne(@Request() req) {
    const chess = await this.chessService.findOneById(req.params.id);
    if (!chess) {
      throw new BadRequestException('Ошибка. Партия не найдена');
    }

    return chess;
  }
}
