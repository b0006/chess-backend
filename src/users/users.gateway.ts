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

interface ClientData {
  id: string;
  username: string;
  client: SocketCustom;
}

type ClientListData = Record<string, ClientData>;

const USER_TEST = 'userTest';

@WebSocketGateway({ transports: ['websocket'] })
export class UsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  wsClientDataList: ClientListData = {};

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(USER_TEST)
  handleMessage(@MessageBody() content: string, @ConnectedSocket() client: SocketCustom): void {
    try {
      const message = JSON.parse(content);
      console.log(`get from CLIENT [${USER_TEST}]`, message);

      const findClient = this.wsClientDataList[client.userId].client;

      findClient.emit(USER_TEST, 'hello');
    } catch (e) {
      console.log(`Error: ${USER_TEST}`);
    }
    // send to all clients
    // this.server.emit(USER_TEST, 'hello');
  }

  afterInit() {
    console.log('Init "users" websocket gateway');
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
    console.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: SocketCustom) {
    try {
      const user = await this.authService.verifyToken(client.handshake.auth.token);

      this.wsClientDataList[user.id] = {
        id: user.id,
        username: user.username,
        client,
      };

      client.userId = user.id;
      console.log(`Client connected: ${this.wsClientDataList[user.id].username} [${client.id}]`);
    } catch (err) {
      console.log('WS: connection not auth');
    }
  }
}
