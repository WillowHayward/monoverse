/**
 * @author: WillHayCode
 */
import { Lipwig } from './Lipwig';
import { User } from './User';
import { Room } from './Room';
import { Message, ErrorCode } from './Types';
import { connection as WebSocketConnection } from 'websocket'; // TODO: This is just for the types, not used at any point
import { generateString } from '@willhaycode/utils';

export class Admin {
    private parent: Lipwig;
    private rooms: Room[];
    private users: User[];
    constructor(parent: Lipwig) {
        this.parent = parent;
        this.rooms = [];
        this.users = [];
    }

    public register(room: Room) {
        this.rooms.push(room);
        room.on('message', (message: Message) => {
            const text = JSON.stringify(message);
            const forwarded: Message = {
                event: 'forwarded',
                data: [text],
                sender: '',
                recipient: [],
            }
            const keys = Object.keys(this.users);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const user = this.users[key];
                forwarded.recipient = [user.getID()];
                console.log(forwarded);
                user.send(forwarded);
            }

        });
    }

    public add(socket: WebSocketConnection, message: Message): ErrorCode {
        let id: string;
        const used = this.users.keys();

        do {
            id = generateString();
        } while (id in used);

        const confirmation: Message = {
            event: 'administrating',
            data: [id],
            sender: '',
            recipient: []
        }

        const user: User = new User(id, socket);
        user.send(confirmation);
        this.users[id] = user;
        return ErrorCode.SUCCESS;
    }

    public isAdmin(id: string): boolean {
        return (id in this.users.keys());
    }

    public handle(message: Message, connection: WebSocketConnection): ErrorCode {
        const id = message.sender;
        if (!this.users[id]) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }
        const user = this.users[id];
        if (user.getSocket() !== connection) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }


        return ErrorCode.SUCCESS;
    }
}
