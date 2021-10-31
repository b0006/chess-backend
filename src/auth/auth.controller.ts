import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
// import { ApiBody, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

// import { HttpFailed } from '../common/dto/http-failed.dto';

// import { AuthLoginDto } from './dto/login.dto';
// import { AuthLoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  // @ApiOperation({ summary: 'Авторизация' })
  // @ApiResponse({ status: 200, description: 'Авторизация прошла успешно', type: AuthLoginResponseDto })
  // @ApiResponse({ status: 401, description: 'Неверный логин или пароль', type: HttpFailed })
  // @ApiBody({ type: AuthLoginDto, description: 'Входные параметры для авторизации' })
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  // @Post('sign-up')
  // @HttpCode(200)
  // async signUp(@Body() bodyData: AuthSignUpDto) {
  //   return this.authService.signUp(bodyData);
  // }

  // @Get('/logout')
  // logout(@Request() req) {
  //   req.session.destroy();
  //   return { success: true };
  // }

  // @UseGuards(AuthenticatedGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
