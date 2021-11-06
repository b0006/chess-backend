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
  userId: string;
}

@WebSocketGateway({ transports: ['websocket'] })
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  wsClientDataList = {};

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('userTest')
  handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() client: SocketCustom,
  ): void {
    console.log(this.wsClientDataList[client.userId].username);
    try {
      const message = JSON.parse(content);
      console.log('userTest', message);

      // const findClient =
      //   this.wsClientDataList['61796ea8bb83a00bfc69e000'].client;
      // findClient.emit('userTest', 'hello');
    } catch (e) {
      console.log('Error: userTest');
    }
    // send to all clients
    // this.server.emit('userTest', 'hello');
  }

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: SocketCustom) {
    const filteredClientDataList = Object.entries(this.wsClientDataList)
      .filter(([id]) => id !== client.userId)
      .reduce(
        (list, [clientId, ws]) => ({
          ...list,
          [clientId]: ws,
        }),
        {},
      );
    this.wsClientDataList = filteredClientDataList;
    console.log(`Client disconnected: ${client.userId}`);
  }

  async handleConnection(client: SocketCustom) {
    try {
      const user = await this.authService.verifyToken(
        client.handshake.auth.token,
      );

      this.wsClientDataList[user.id] = {
        id: user.id,
        username: user.username,
        client,
      };

      client.userId = user.id;
      console.log(
        `Client connected: ${this.wsClientDataList[user.id].username} [${
          client.id
        }]`,
      );
    } catch (err) {
      console.log('WS: connection not auth');
    }
  }
}
