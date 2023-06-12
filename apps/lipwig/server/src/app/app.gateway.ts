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
    HostEvents,
    PING_EVENT
} from '@whc/lipwig/model';
import { RoomService } from '../room/room.service';
import { UseGuards } from '@nestjs/common';
import { RoomGuard } from '../room/room.guard';

@WebSocketGateway()
@UseGuards(RoomGuard)
export class AppGateway implements OnGatewayDisconnect {
    constructor(private rooms: RoomService) {}

    @SubscribeMessage(HOST_EVENT.CREATE)
    create(socket: LipwigSocket, payload: HostEvents.CreateData) {
        const config = payload.config;
        this.rooms.create(socket, config);
    }

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(socket: LipwigSocket, payload: ClientEvents.JoinData) {
        const code = payload.code;
        const options = payload.options;
        this.rooms.join(socket, code, options);
    }

    @SubscribeMessage(HOST_EVENT.RECONNECT)
    @SubscribeMessage(CLIENT_EVENT.RECONNECT)
    reconnect(socket: LipwigSocket, payload: HostEvents.ReconnectData | ClientEvents.ReconnectData) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.reconnect(socket, code, id);
    }

    /* TODO
     * @SubscribeMessage(HOST_EVENT.ADMINISTRATE)
     * administrate(socket: LipwigSocket, payload: AdministrateEventData) {
     *   this.rooms.administrate(socket, payload);
     * }
    */

    @SubscribeMessage(HOST_EVENT.MESSAGE)
    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
    message(socket: LipwigSocket, payload: HostEvents.MessageData | ClientEvents.MessageData) {
        this.rooms.message(socket, payload);
    }

    @SubscribeMessage(PING_EVENT.PING_SERVER)
    pingServer(socket: LipwigSocket, payload: HostEvents.PingServerData | ClientEvents.PingServerData) {
        const time = payload.time;
        socket.send(JSON.stringify({
            event: PING_EVENT.PONG_SERVER,
            data: { time }
        }));
    }

    @SubscribeMessage(CLIENT_EVENT.PING_HOST)
    pingHost(socket: LipwigSocket, payload: ClientEvents.PingHostData) {
        const time = payload.time;
        this.rooms.pingHost(socket, time);
    }

    @SubscribeMessage(HOST_EVENT.PONG_HOST)
    pongHost(socket: LipwigSocket, payload: HostEvents.PongHostData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pongHost(socket, time, id);
    }

    @SubscribeMessage(HOST_EVENT.PING_CLIENT)
    pingClient(socket: LipwigSocket, payload: HostEvents.PingClientData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pingClient(socket, time, id);
    }

    @SubscribeMessage(CLIENT_EVENT.PONG_CLIENT)
    pongClient(socket: LipwigSocket, payload: ClientEvents.PongClientData) {
        const time = payload.time;
        this.rooms.pongClient(socket, time);
    }



    @SubscribeMessage(HOST_EVENT.KICK)
    kick(socket: LipwigSocket, payload: HostEvents.KickData) {
        const id = payload.id;
        const reason = payload.reason;
        this.rooms.kick(socket, id, reason);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_JOIN)
    localJoin(socket: LipwigSocket) {
        this.rooms.localJoin(socket);
    }

    handleDisconnect(socket: LipwigSocket) {
        this.rooms.disconnect(socket);
    }
}
