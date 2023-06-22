/**
 * Class to initate interaction with a Lipwig server using promises
 * @author: WillHayCode
 */
//TODO: Update the string to enums from the model
import {
    ERROR_CODE,
    CreateOptions,
    JoinOptions
} from '@whc/lipwig/model';
import { Host } from './host';
import { Client } from './client';

export class Lipwig {
    static create(url: string, config: CreateOptions = {}): Promise<Host> {
        return new Promise((resolve, reject) => {
            const host = new Host(url, config);
            host.on('created', (code: string, ...args: any) => {
                resolve(host);
            });

            host.on('host-reconnected', () => {
                resolve(host);
            });

            host.once('error', (error: ERROR_CODE, message?: string) => {
                    reject({ error, message });
                }
            );
        });
    }

    static join(
        url: string,
        code: string,
        options: JoinOptions = {}
    ): Promise<Client> {
        return new Promise((resolve, reject) => {
            const client = new Client(url, code, options);
            client.on('joined', () => {
                resolve(client);
            });

            client.on('reconnected', () => {
                resolve(client);
            });

            client.once('error',
                (error: ERROR_CODE, message?: string) => {
                    reject({ error, message });
                }
            );
        });
    }

    static reconnect(
        url: string,
        code: string,
        id: string
    ): Promise<Host | Client | null> {
        return new Promise((resolve, reject) => {
            // TODO
            resolve(null);
        });
    }
}