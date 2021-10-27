import {
  Controller,
  Request,
  Get,
  Delete,
  Post,
  Body,
  UseGuards,
  UseFilters,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ChessService } from './chess.service';
import { AuthFilter } from '../auth/filters/auth.filter';
import { ChessCreateDto } from './dto/chess-create.dto';
import { ChessDeleteDto } from './dto/chess-delete.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@UseFilters(AuthFilter)
@Controller('/api/chess')
export class ChessController {
  constructor(private chessService: ChessService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  async create(@Request() req, @Body() body: Omit<ChessCreateDto, 'creater'>) {
    const created = await this.chessService.create({
      ...body,
      creater: req.user.id,
    });
    if (!created) {
      throw new BadRequestException('Ошибка. Партия не была создана');
    }
    return created.toJSON();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  async findByProfile(@Request() req) {
    // TODO: еще найти партии, где пользователь участник
    const chessList = await this.chessService.findAll({
      creater: req.user.id,
    });

    return chessList;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/')
  async remove(@Request() req, @Body() body: ChessDeleteDto) {
    const chessId = body.id;

    const chess = await this.chessService.findOneById(chessId);
    if (!chess) {
      throw new NotFoundException('Партия не найдена для удаления');
    }

    if (chess.creater !== req.user?.id) {
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

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async findOne(@Request() req) {
    const chess = await this.chessService.findOneById(req.params.id);
    if (!chess) {
      throw new BadRequestException('Ошибка. Партия не найдена');
    }

    return chess;
  }
}
