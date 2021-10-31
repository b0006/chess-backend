import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  @SubscribeMessage('userTest')
  handleMessage(client: Socket, payload: string): void {
    try {
      const message = JSON.parse(payload);
      console.log('userTest', message);
    } catch (e) {
      console.log('Error: userTest');
    }
    // this.server.emit('userTest', payload);
  }

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
