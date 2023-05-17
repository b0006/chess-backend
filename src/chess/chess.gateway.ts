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
  clients: Record<string, SocketCustom>;
}

type ClientListData = Record<string, ClientData>;

const USER_EVENT = {
  getPartyList: 'getPartyList',
};

const ERROR = {
  initConnection: 'initConnection',
};

@WebSocketGateway({ transports: ['websocket'] })
export class ChessGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  wsClientDataList: ClientListData = {};

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(USER_EVENT.getPartyList)
  getPartyList(@MessageBody() content: string, @ConnectedSocket() client: SocketCustom): void {
    try {
      const message = JSON.parse(content);
      console.log(`get from CLIENT [${USER_EVENT.getPartyList}]`, message);

      Object.values(this.wsClientDataList[client.userId].clients).forEach((anyClient) => {
        anyClient.emit(USER_EVENT.getPartyList, `hello from ${anyClient.id}`);
      });
    } catch (e) {
      console.log(`Error: ${USER_EVENT.getPartyList}`);
    }
    // send to all clients
    // this.server.emit(USER_TEST, 'hello');
  }

  afterInit() {
    console.log('Init "chess" websocket gateway');
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

      if (!user) {
        throw new Error('Token is invalid');
      }

      this.wsClientDataList[user.id] = {
        id: user.id,
        username: user.username,
        clients: {
          ...(this.wsClientDataList?.[user.id]?.clients || {}),
          [client.id]: client,
        },
      };

      client.userId = user.id;
      console.log(`Client connected: ${this.wsClientDataList[user.id].username} [${client.id}]`);
    } catch (err) {
      console.log('WS: connection not auth', err);
      client.emit(ERROR.initConnection, err?.toString() || 'Connection failed');
    }
  }
}
