import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = client.handshake?.auth.token;
      if (!token) {
        return false;
      }
      const user = await this.authService.verifyToken(token);
      if (!user) {
        return false;
      }

      // context.switchToWs().getClient().userData = {
      //   id: user.id,
      //   username: user.username,
      // };

      return Boolean(user);
    } catch (err) {
      console.log(err.message);
      throw new WsException(err.message);
    }
  }
}
