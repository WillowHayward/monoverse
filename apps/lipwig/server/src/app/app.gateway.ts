import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LipwigSocket } from './app.model';
import {
    CreateEventData,
    JoinEventData,
    ReconnectEventData,
    AdministrateEventData,
    ClientMessageEventData,
} from '@whc/lipwig/types';
import { CLIENT_EVENT } from '@whc/lipwig/types';
import { RoomService } from '../room/room.service';
import { Logger } from '@nestjs/common';
import { WebSocket } from 'ws';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(CLIENT_EVENT.CREATE)
    create(user: LipwigSocket, payload: CreateEventData) {
        this.rooms.create(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(user: LipwigSocket, payload: JoinEventData) {
        this.rooms.join(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.RECONNECT)
    reconnect(user: LipwigSocket, payload: ReconnectEventData) {
        this.rooms.reconnect(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.ADMINISTRATE)
    administrate(user: LipwigSocket, payload: AdministrateEventData) {
        // stub
    }

    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
    message(user: LipwigSocket, payload: ClientMessageEventData) {
        this.rooms.message(user, payload);
    }

    handleConnection(socket: WebSocket) {
        //TODO: Is this needed?
        //Logger.log(user.url);
        //Logger.log(user);
    }

    handleDisconnect(user: LipwigSocket) {
        this.rooms.disconnect(user);
    }
}
