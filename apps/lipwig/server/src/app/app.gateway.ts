import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { LipwigSocket } from './app.model';
import {
    CreateEventData,
    JoinEventData,
    ReconnectEventData,
    AdministrateEventData,
    ClientMessageEventData,
    CloseEventData,
    LeaveEventData,
    PingEventData,
    KickEventData,
    LocalJoinEventData,
    LocalLeaveEventData,
} from '@whc/lipwig/model';
import { CLIENT_EVENT } from '@whc/lipwig/model';
import { RoomService } from '../room/room.service';
import { UseGuards } from '@nestjs/common';
import { RoomGuard } from '../room/room.guard';

@WebSocketGateway()
@UseGuards(RoomGuard)
export class AppGateway implements OnGatewayDisconnect {
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

    @SubscribeMessage(CLIENT_EVENT.CLOSE)
    close(user: LipwigSocket, payload: CloseEventData) {
        this.rooms.close(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.LEAVE)
    leave(user: LipwigSocket, payload: LeaveEventData) {
        this.rooms.leave(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.ADMINISTRATE)
    administrate(user: LipwigSocket, payload: AdministrateEventData) {
        this.rooms.administrate(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.MESSAGE)
    message(user: LipwigSocket, payload: ClientMessageEventData) {
        this.rooms.message(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.PING)
    ping(user: LipwigSocket, payload: PingEventData) {
        this.rooms.ping(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.KICK)
    kick(user: LipwigSocket, payload: KickEventData) {
        this.rooms.kick(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.LOCAL_JOIN)
    localJoin(user: LipwigSocket, payload: LocalJoinEventData) {
        this.rooms.localJoin(user, payload);
    }

    @SubscribeMessage(CLIENT_EVENT.LOCAL_LEAVE)
    localLeave(user: LipwigSocket, payload: LocalLeaveEventData) {
        this.rooms.localLeave(user, payload);
    }

    handleDisconnect(user: LipwigSocket) {
        this.rooms.disconnect(user);
    }
}
