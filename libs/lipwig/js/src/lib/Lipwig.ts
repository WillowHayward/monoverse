/**
 * Class to initate interaction with a Lipwig server using promises
 * @author: WillHayCode
 */
import { RoomConfig, UserOptions } from "@whc/lipwig/types";
import { Host } from "./Host";
import { Client } from "./Client";

export class Lipwig {
    static create(url: string, config: RoomConfig = {}): Promise<Host> {
        return new Promise((resolve, reject) => {
            const host = new Host(url, config);
            host.on('created', (code: string) => {
                resolve(host);
            });

            // TODO: Error handling
        });

    }

    static join(url: string, code: string, options: UserOptions = {}): Promise<Client> {
        return new Promise((resolve, reject) => {
            const client = new Client(url, code, options);
            client.on('joined', () => {
                resolve(client);
            });

            // TODO: Error handling
        });
    }

}
