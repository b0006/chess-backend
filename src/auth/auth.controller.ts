import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Get,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { UsersService } from '../users/users.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // TODO: remove (temp request for tests)
  @Get('users')
  getUsers(@Request() req) {
    return this.usersService.findAll();
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() bodyData: AuthSignUpDto) {
    return this.authService.signUp(bodyData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne({ username: req.user.username });
    // return req.user;
  }
}
