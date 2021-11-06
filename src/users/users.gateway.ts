import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { WsJwtGuard } from '../auth/guards/ws-auth-guard';

interface SocketCustom extends Socket {
  userData: {
    id: string;
    username: string;
  };
}

@WebSocketGateway({ transports: ['websocket'] })
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('userTest')
  handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() client: SocketCustom,
  ): void {
    console.log(client.userData);
    try {
      const message = JSON.parse(content);
      console.log('userTest', message);
    } catch (e) {
      console.log('Error: userTest');
    }
    // this.server.emit('userTest', payload);
  }

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: SocketCustom) {
    console.log(`Client disconnected: ${client.userData.username}`);
  }

  async handleConnection(client: SocketCustom, ...args: any[]) {
    try {
      const result = await this.authService.verifyToken(
        client.handshake.auth.token,
      );
      client.userData = { id: result.id, username: result.username };
    } catch (err) {
      console.log('WS: connection not auth');
    }
    console.log(`Client connected: ${client.userData.username}`);
  }
}
