import { LipwigSocket } from "./LipwigSocket";
import { WebSocket } from '../app/app.model';

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

const mockedWebSocket = WebSocket as jest.MockedClass<typeof WebSocket>;

describe('LipwigSocket', () => {
    let ws: WebSocket;

    beforeEach(async () => {
        mockedWebSocket.mockClear();
        ws = new WebSocket('');
    });

    it('should be defined', () => {
        new LipwigSocket(ws);
        expect(ws.on).toBeCalledWith('close', expect.anything());
    });

    it('should initialize as host', () => {
        const socket = new LipwigSocket(ws);
        socket.initialize('', true, null);

        expect(ws.on).toBeCalledTimes(2);
    });

    it('should initialize as client', () => {
        const socket = new LipwigSocket(ws);
        socket.initialize('', false, null);

        expect(ws.on).toBeCalledTimes(2);
    });
});
