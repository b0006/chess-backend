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

import { BoardsService } from './boards.service';
import { AuthFilter } from '../auth/filters/auth.filter';
import { BoardCreateDto } from './dto/board-create.dto';
import { BoardDeleteDto } from './dto/board-delete.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@UseFilters(AuthFilter)
@Controller('/api/board')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  async create(@Request() req, @Body() body: Omit<BoardCreateDto, 'authorId'>) {
    const board = await this.boardService.findOneByProfile(
      { title: body.title },
      req.user.id,
    );
    if (board) {
      throw new BadRequestException(
        'Ошибка. Доска с таким названием уже существует',
      );
    }

    const created = await this.boardService.create({
      ...body,
      authorId: req.user.id,
    });
    if (!created) {
      throw new BadRequestException('Ошибка. Доска не была создана');
    }
    return created.toJSON();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  async findProfileBoards(@Request() req) {
    const boards = await this.boardService.findAll({
      authorId: req.user.id,
    });

    return boards;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/')
  async remove(@Request() req, @Body() body: BoardDeleteDto) {
    const boardId = body.id;

    const board = await this.boardService.findOneById(boardId);
    if (!board) {
      throw new NotFoundException('Доска не найдена для удаления');
    }

    if (board.authorId !== req.user?.id) {
      throw new BadRequestException('Запрещено удалять чужие доски');
    }

    const deleted = await this.boardService.remove(boardId);
    if (!deleted) {
      throw new NotFoundException(
        'Доска не была удалена. Попробуйте повторить попытку',
      );
    }
    return { status: true };
  }

  @Get('/:id')
  async findOne(@Request() req) {
    const board = await this.boardService.findOneById(req.params.id);
    if (!board) {
      throw new BadRequestException('Ошибка. Доска не найдена');
    }

    return board;
  }
}
