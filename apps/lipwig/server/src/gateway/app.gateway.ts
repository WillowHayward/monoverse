import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
} from '@nestjs/websockets';
import {
    CLIENT_EVENT,
    HOST_EVENT,
    ClientEvents,
    HostEvents,
    PING_EVENT
} from '@whc/lipwig/model';
import { RoomService } from '../room/room.service';
import { UseGuards } from '@nestjs/common';
import { RoomGuard } from '../guards/room.guard';
import { WebSocket } from '../app/app.model';
import { LipwigSocket } from '../classes/LipwigSocket';

@WebSocketGateway()
@UseGuards(RoomGuard)
export class AppGateway implements OnGatewayConnection {
    constructor(private rooms: RoomService) {}

    handleConnection(socket: WebSocket) {
        // TODO: This is firing twice on reconnection, for some reason
        const lipwigSocket = new LipwigSocket(socket);
        socket.socket = lipwigSocket;
    }

    @SubscribeMessage(HOST_EVENT.CREATE)
    create(socket: WebSocket, payload: HostEvents.CreateData) {
        const config = payload.config;
        this.rooms.create(socket.socket, config);
    }

    @SubscribeMessage(CLIENT_EVENT.JOIN)
    join(socket: WebSocket, payload: ClientEvents.JoinData) {
        const code = payload.code;
        const options = payload.options;
        this.rooms.join(socket.socket, code, options);
    }

    @SubscribeMessage(HOST_EVENT.RECONNECT)
    @SubscribeMessage(CLIENT_EVENT.RECONNECT)
    reconnect(socket: WebSocket, payload: HostEvents.ReconnectData | ClientEvents.ReconnectData) {
        const code = payload.code;
        const id = payload.id;
        this.rooms.reconnect(socket.socket, code, id);
    }

    /* TODO
     * @SubscribeMessage(HOST_EVENT.ADMINISTRATE)
     * administrate(socket: WebSocket, payload: AdministrateEventData) {
     *   this.rooms.administrate(socket, payload);
     * }
    */

    @SubscribeMessage(HOST_EVENT.MESSAGE)
    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
    message(socket: WebSocket, payload: HostEvents.MessageData | ClientEvents.MessageData) {
        this.rooms.message(socket.socket, payload);
    }

    @SubscribeMessage(PING_EVENT.PING_SERVER)
    pingServer(socket: WebSocket, payload: HostEvents.PingServerData | ClientEvents.PingServerData) {
        const time = payload.time;
        socket.send(JSON.stringify({
            event: PING_EVENT.PONG_SERVER,
            data: { time }
        }));
    }

    @SubscribeMessage(CLIENT_EVENT.PING_HOST)
    pingHost(socket: WebSocket, payload: ClientEvents.PingHostData) {
        const time = payload.time;
        this.rooms.pingHost(socket.socket, time);
    }

    @SubscribeMessage(HOST_EVENT.PONG_HOST)
    pongHost(socket: WebSocket, payload: HostEvents.PongHostData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pongHost(socket.socket, time, id);
    }

    @SubscribeMessage(HOST_EVENT.PING_CLIENT)
    pingClient(socket: WebSocket, payload: HostEvents.PingClientData) {
        const time = payload.time;
        const id = payload.id;
        this.rooms.pingClient(socket.socket, time, id);
    }

    @SubscribeMessage(CLIENT_EVENT.PONG_CLIENT)
    pongClient(socket: WebSocket, payload: ClientEvents.PongClientData) {
        const time = payload.time;
        this.rooms.pongClient(socket.socket, time);
    }

    @SubscribeMessage(HOST_EVENT.KICK)
    kick(socket: WebSocket, payload: HostEvents.KickData) {
        const id = payload.id;
        const reason = payload.reason;
        this.rooms.kick(socket.socket, id, reason);
    }

    @SubscribeMessage(HOST_EVENT.LOCAL_JOIN)
    localJoin(socket: WebSocket) {
        this.rooms.localJoin(socket.socket);
    }
}
