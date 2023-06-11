import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LipwigSocket } from './app.model';
import {
    CLIENT_EVENT,
    HOST_EVENT,
    ClientEvents,
    HostEvents
} from '@whc/lipwig/model';
import { RoomService } from '../room/room.service';
import { UseGuards } from '@nestjs/common';
import { RoomGuard } from '../room/room.guard';

@WebSocketGateway()
@UseGuards(RoomGuard)
export class AppGateway implements OnGatewayDisconnect {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(HOST_EVENT.CREATE)
    create(user: LipwigSocket, payload: HostEvents.CreateData) {
        this.rooms.create(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(user: LipwigSocket, payload: ClientEvents.JoinData) {
        this.rooms.join(user, payload);
    }

    @SubscribeMessage(HOST_EVENT.RECONNECT)
    @SubscribeMessage(CLIENT_EVENT.RECONNECT)
    reconnect(user: LipwigSocket, payload: HostEvents.ReconnectData | ClientEvents.ReconnectData) {
        this.rooms.reconnect(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.LEAVE)
    leave(user: LipwigSocket, payload: ClientEvents.LeaveData) {
        this.rooms.leave(user, payload);
    }

    /* TODO
     * @SubscribeMessage(HOST_EVENT.ADMINISTRATE)
     * administrate(user: LipwigSocket, payload: AdministrateEventData) {
     *   this.rooms.administrate(user, payload);
     * }
    */

    @SubscribeMessage(HOST_EVENT.MESSAGE)
    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
    message(user: LipwigSocket, payload: HostEvents.MessageData | ClientEvents.MessageData) {
        this.rooms.message(user, payload);
    }

    @SubscribeMessage(HOST_EVENT.PING)
    @SubscribeMessage(CLIENT_EVENT.PING)
    ping(user: LipwigSocket, payload: HostEvents.PingData | ClientEvents.PingData) {
        this.rooms.ping(user, payload);
    }

    @SubscribeMessage(HOST_EVENT.KICK)
    kick(user: LipwigSocket, payload: HostEvents.KickData) {
        this.rooms.kick(user, payload);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_JOIN)
    localJoin(user: LipwigSocket) {
        this.rooms.localJoin(user);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_LEAVE)
    localLeave(user: LipwigSocket) {
        this.rooms.localLeave(user);
    }

    handleDisconnect(user: LipwigSocket) {
        this.rooms.disconnect(user);
    }
}
