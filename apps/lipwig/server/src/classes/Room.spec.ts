import { SERVER_CLIENT_EVENT, SERVER_HOST_EVENT } from "@whc/lipwig/model";
import { WebSocket } from "../app/app.model";
import { LipwigSocket } from "./LipwigSocket";
import { Room } from "./Room";
jest.mock('./LipwigSocket');
jest.mock('../app/app.model', () => {
    return {
        WebSocket: jest.fn().mockImplementation(() => {
            return {
                on: jest.fn(),
                send: jest.fn(),
                close: jest.fn()
            }
        })
    }
});

const mockedLipwigSocket = LipwigSocket as jest.MockedClass<typeof LipwigSocket>;

describe('Room', () => {
    let socket: WebSocket;
    let host: LipwigSocket;
    beforeEach(async () => {
        mockedLipwigSocket.mockClear();
        socket = new WebSocket('');
        host = new LipwigSocket(socket);
        host.id = 'HOSTID';
    });

    it ('should alert host on creation', () => {
        new Room(host, 'ROOMCODE', {});

        expect(host.send).toBeCalledWith({
            event: SERVER_HOST_EVENT.CREATED,
            data: {
                code: 'ROOMCODE',
                id: 'HOSTID'
            }
        });
    });

    it ('should alert host and client on joining', () => {
        const room = new Room(host, 'ROOMCODE', {});
        const client = new LipwigSocket(socket);
        client.id = 'CLIENTID';

        room.join(client, {});

        expect(host.send).toBeCalledWith({
            event: SERVER_HOST_EVENT.JOINED,
            data: {
                id: 'CLIENTID',
                options: {}
            }
        });

        expect(client.send).toBeCalledWith({
            event: SERVER_CLIENT_EVENT.JOINED,
            data: {
                id: 'CLIENTID'
            }
        });
    });

    /* TODO: Figure out testing event listeners w/ jest
        * it ('should alert host on client disconnection', () => {
        const room = new Room(host, 'ROOMCODE', {});
        const client = new LipwigSocket(socket);
        client.id = 'CLIENTID';

        room.join(client, {});
        client.emit('disconnect');

        expect(host.send).toHaveBeenLastCalledWith({
            event: SERVER_HOST_EVENT.CLIENT_DISCONNECTED,
            data: {
                id: 'CLIENTID'
            }
        });

    });*/
});
