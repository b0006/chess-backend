import {
  Controller,
  Request,
  Response,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
  HttpCode,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth.sign-up.dto';
import { AuthFilter } from './filters/auth.filter';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.guard';

@UseFilters(AuthFilter)
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Request() req) {
    return req.user;
  }

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() bodyData: AuthSignUpDto) {
    return this.authService.signUp(bodyData);
  }

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { success: true };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
