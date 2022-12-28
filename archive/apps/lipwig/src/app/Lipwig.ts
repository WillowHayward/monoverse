/**
 * @author: WillHayCode
 */
import * as http from 'http';
import * as https from 'https';
import * as WebSocket from 'websocket';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { EventManager } from '@willhaycode/event-manager';
import { Room } from './Room';
import { defaultConfig, ErrorCode, LipwigOptions, LipwigConfig, Message, RoomConfig, UserOptions } from './Types';
import { User } from './User';
import { Admin } from './Admin';
import { generateString } from '@willhaycode/utils';

type RoomMap = {
    [index: string]: Room;
};

export class Lipwig extends EventManager {
    private logger: winston.Logger;
    private options: LipwigOptions;
    private ws: WebSocket.server;
    private rooms: RoomMap;
    private reserved: EventManager;
    private connections: WebSocket.connection[];

    private admin: Admin;
    constructor(config: LipwigConfig = {}) {
        super();
        this.admin = new Admin(this);

        const options: LipwigOptions = {
            ...defaultConfig,
            ...config
        }

        let consoleLogger: Console | null;

        if (process.env.NODE_ENV == 'development') {
            consoleLogger = new console.Console({ stdout: process.stdout, stderr: process.stderr });
        }

        const dailyFileConfig = {
            dirname: 'logs',
            filename: 'lipwig-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }

        const fileTransport = new winston.transports.DailyRotateFile(dailyFileConfig);
        fileTransport.on('rotate', (oldFilename, newFilename) => {
            if (consoleLogger) {
                consoleLogger.info('Rotating Log File', oldFilename, newFilename);
            }
        });

        const transports = [
            fileTransport,
        ];


        dailyFileConfig.filename = 'lipwig-%DATE%.exception.log';
        const fileExceptionHandler = new winston.transports.DailyRotateFile(dailyFileConfig);
        fileExceptionHandler.on('rotate', function(oldFilename, newFilename) {
            console.log('Rotating Exception Log File', oldFilename, newFilename);
        });

        const exceptionHandlers = [
            fileExceptionHandler,
        ];

        this.logger = winston.createLogger({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          transports: transports,
          exceptionHandlers: exceptionHandlers
        });

		console.log = (...args: unknown[]) => {
            this.logger.info.call(this.logger, ...args);
        }
		console.info = (...args: unknown[]) => {
            this.logger.info.call(this.logger, ...args);
            if (consoleLogger) {
                consoleLogger.info(...args);
            }
        }
		console.warn = (...args: unknown[]) => {
            this.logger.warn.call(this.logger, ...args);
        }
		console.error = (...args: unknown[]) => {
            this.logger.error.call(this.logger, ...args);
        }
		console.debug = (...args: unknown[]) => {
            this.logger.debug.call(this.logger, ...args);
        }

        if (options.http === undefined) {
            const server: http.Server = http.createServer();

            server.on('error', (err: Error): void => {
                console.error(err);
                console.error('Port ' + options.port + ' in use');
            });

            server.listen(options.port, () => {
                console.info('Listening on ' + options.port);
                this.emit('started');
            });

            options.http = server;
        } else {
            this.emit('started');
        }

        this.options = options;

        this.ws = new WebSocket.server({
            httpServer: options.http,
            autoAcceptConnections: false
        });

        this.ws.on('request', (request: WebSocket.request): void => {
            this.newRequest(request);
        });

        this.rooms = {};
        this.connections = [];
        this.reserved = new EventManager();

        this.reserved.on('create', this.create, {object: this});
        this.reserved.on('join', this.join, {object: this});
        this.reserved.on('administrate', this.administrate, {object: this});
        this.reserved.on('reconnect', this.reconnect, {object: this});
        this.reserved.on('close', this.close, {object: this});
        this.reserved.on('kick', this.kick, {object: this});
        this.reserved.on('lw-ping', this.ping, {object: this});
    }

    public exit(): void {
        if (this.options.http instanceof http.Server || this.options.http instanceof https.Server) {
            this.options.http.close();

            this.options.http.on('close', (): void => {
                this.emit('closed');
            });
        } else {
          // This code pertains to server lists, which are current unimplemented

            /*const httpList: (http.Server | https.Server)[] = (<(http.Server | https.Server)[]>this.options.http);
            // Cast to array for type safety
            httpList.forEach((instance: http.Server | https.Server): void => {
                instance.close();
                instance.on('close', (): void => {
                    // TODO: This might emit before all http instances are closed
                    this.emit('closed');
                });
            });*/
        }

        this.connections.slice(0).forEach((socket: WebSocket.connection): void => {
            if (socket.connected) {
                socket.close();
            }
        });
    }

    private newRequest(request: WebSocket.request): void {
        if (!this.isOriginAllowed(request.origin)) {
            request.reject();

            return;
        }

        const connection: WebSocket.connection = request.accept(request.requestedProtocols[0], request.origin);
        this.connections.push(connection);
        connection.on('message', (message: WebSocket.IMessage): void => {
            if (!message.utf8Data) {
                const error = ErrorCode.MALFORMED;
                this.reportError(connection, error, 'Could not parse utf8Data');

                return;
            }

            const text: string = message.utf8Data.toString();
            const parsed: Message | ErrorCode = this.getMessage(text);
            console.log(text);

            if (typeof parsed === 'number') {
                // ErrorCode
                const error: ErrorCode = parsed;
                this.reportError(connection, error, text);

                return;
            }
            const response: ErrorCode = this.handle(parsed, connection);

            if (response !== ErrorCode.SUCCESS) {
                this.reportError(connection, response, text);
            }
        });

        connection.on('close', (): void => {
            const index: number = this.connections.indexOf(connection);
            this.connections.splice(index, 1);
        });

        return;
    }

    private getMessage(text: string): ErrorCode | Message {
        let message: Message;
        try {
            message = JSON.parse(text);
        } catch (error) {
            return ErrorCode.MALFORMED;
        }

        if (!this.isValidMessage(message)) {
            return ErrorCode.MALFORMED;
        }

        return message;
    }

    private isValidMessage(message: Message): boolean {
        // TODO: Properly implement this

        if (typeof message.data !== 'object' ||
            typeof message.event !== 'string' ||
            typeof message.sender !== 'string' ||
            typeof message.recipient !== 'object') {
                return false;
        }

        const keys: string[] = Object.keys(message);
        if (keys.length !== 4) {
            return false;
        }

        return true;
    }

    private reportError(connection: WebSocket.connection, code: ErrorCode, cause: string): void {
        const message: Message = {
            event: 'error',
            data: [code, cause],
            sender: '',
            recipient: []
        };
        const text: string = JSON.stringify(message);
        console.log(text);
        connection.send(text);
    }

    private isOriginAllowed(origin: string): boolean {
        // TODO: Origin checking
        if (origin) {
          return true;
        }

        return true;
    }

    private handle(message: Message, connection: WebSocket.connection): ErrorCode {
        if (this.reserved.contains(message.event)) {
          
          const callback = this.reserved.get(message.event);
          const response = <ErrorCode> callback(connection, message);
          
          return response;
        }

        if (this.admin.isAdmin(message.sender)) {
            return this.admin.handle(message, connection);
        }

        const roomID: string = message.sender.slice(0, 4);
        const room: Room | undefined = this.find(roomID);

        if (room === undefined) {
            return ErrorCode.ROOMNOTFOUND;
        }

        return room.route(message);
    }

    private ping(connection: WebSocket.connection, message: Message): ErrorCode {
        message.event = 'pong';
        const text: string = JSON.stringify(message);
        connection.send(text);

        return ErrorCode.SUCCESS;
    }

    private create(connection: WebSocket.connection, message: Message): ErrorCode {
        const options: RoomConfig = <RoomConfig> message.data[0] || {};
        if (typeof options !== 'object') {
            return ErrorCode.MALFORMED;
        }

        let id: string;
        do {
            id = generateString();
        } while (this.find(id) !== undefined);

        const room: Room = new Room(id, connection, options);
        this.rooms[id] = room;
        this.admin.register(room);

        return ErrorCode.SUCCESS;
    }

    private join(connection: WebSocket.connection, message: Message): ErrorCode {

        if (typeof message.data[0] !== 'string') {
            return ErrorCode.MALFORMED;
        }

        const code: string = message.data[0];

        let data: UserOptions = <UserOptions> message.data[1];

        if (data === undefined) {
            data = {};
        }

        if (typeof data !== 'object') {
            return ErrorCode.MALFORMED;
        }

        const room: Room | undefined = this.find(code);

        if (room === undefined) {
            return ErrorCode.ROOMNOTFOUND;
        }

        if (data.password === undefined) {
          data.password = '';
        }

        if (typeof data.password !== 'string') {
          return ErrorCode.MALFORMED;
        }

        const password = data.password;
        if (!room.checkPassword(password)) {
            return ErrorCode.INCORRECTPASSWORD;
        }
        delete data.password;

        return room.join(connection, data);
    }

    private administrate(connection: WebSocket.connection, message: Message): ErrorCode {
        return this.admin.add(connection, message);
    }

    private reconnect(connection: WebSocket.connection, message: Message): ErrorCode {
        if (typeof message.data[0] !== 'string') {
          return ErrorCode.MALFORMED;
        }

        const id: string = message.data[0];
        const code: string = id.slice(0, 4);
        const room: Room | undefined = this.find(code);

        if (room === undefined) {
            return ErrorCode.ROOMNOTFOUND;
        }

        return room.reconnect(connection, id);
    }

    private close(connection: WebSocket.connection, message: Message): ErrorCode {
        if (typeof message.data[0] !== 'string') {
          return ErrorCode.MALFORMED;
        }

        const reason: string = message.data[0];
        const id: string = message.sender;
        const room: Room | undefined = this.find(id);

        if (room === undefined) {
            return ErrorCode.ROOMNOTFOUND;
        }

        if (id !== room.getID()) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }

        const user: User | undefined = room.find(id);

        if (user === undefined) {
            return ErrorCode.USERNOTFOUND;
        }

        if (!user.equals(connection)) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }

        room.close(reason);
        delete this.rooms[id];

        return ErrorCode.SUCCESS;
    }

    private kick(connection: WebSocket.connection, message: Message): ErrorCode {
        if (typeof message.data[0] !== 'string') {
          return ErrorCode.MALFORMED;
        }

        if (typeof message.data[1] !== 'string') {
          return ErrorCode.MALFORMED;
        }

        const userID: string = message.data[0];
        const reason: string = message.data[1];
        const id: string = message.sender;
        const room: Room | undefined = this.find(id);

        if (room === undefined) {
            return ErrorCode.ROOMNOTFOUND;
        }

        if (id !== room.getID()) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }

        const user: User | undefined = room.find(id);

        if (user === undefined) {
            return ErrorCode.USERNOTFOUND;
        }

        if (!user.equals(connection)) {
            return ErrorCode.INSUFFICIENTPERMISSIONS;
        }

        return room.kick(userID, reason);
    }

    private find(code: string): Room | undefined {
      return this.rooms[code];
    }
}
