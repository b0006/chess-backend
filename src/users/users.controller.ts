import { Get, Request, NotFoundException } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('/api/profile')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  async findOne(@Request() req) {
    const user = await this.userService.findOne({
      username: req.query.username,
    });

    if (!user) {
      throw new NotFoundException('Ther user was not found');
    }

    return user;
  }
}
