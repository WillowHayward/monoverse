import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { LipwigSocket } from './lipwig.model';
import { Message } from '@willhaycode/lipwig-js';

@WebSocketGateway()
export class LipwigGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @SubscribeMessage('create')
    handleCreate(client: LipwigSocket, payload: Message) {
        // stub
    }

    @SubscribeMessage('join')
    handleJoin(client: LipwigSocket, payload: Message) {
        // stub
    }

    @SubscribeMessage('reconnect')
    handleReconnect(client: LipwigSocket, payload: Message) {
        // stub
    }

    @SubscribeMessage('admin')
    handleAdmin(client: LipwigSocket, payload: Message): string {
        // stub
    }

    @SubscribeMessage('message')
    handleMessage(client: LipwigSocket, payload: Message): string {
        // stub
    }

    initialiseUser(client: LipwigSocket) {

    }

    handleConnection(client: LipwigSocket) {
        console.log(client);
    }

    handleDisconnect(client: LipwigSocket) {
        //console.log(client);
    }



}
