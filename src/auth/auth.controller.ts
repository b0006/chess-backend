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

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  // @Get('/logout')
  // logout(@Request() req) {
  //   req.session.destroy();
  //   return { success: true };
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
