import { Injectable } from '@angular/core';
import { LipwigService } from '@lipwig/angular';
import { Client, Host, JoinRequest, User } from '@lipwig/js';
import { Chatter, Reconnectable } from './chat.model';
import { ClientService } from './client.service';

@Injectable({
    providedIn: 'root'
})
export class HostService implements Reconnectable {
    private host: Host;
    //private url = window.env['LIPWIG_HOST'];
    private url = 'ws://localhost:8989';

    constructor(private lipwig: LipwigService, private client: ClientService) { }

    async connect(name: string): Promise<Client> {
        const host = await this.lipwig.create(this.url, {
            name: 'lipwig-chat',
            required: ['name']
        });
        this.host = host;

        const local = await this.lipwig.joinLocal({
            data: {
                name
            }
        });
        this.client.setClient(local);

        this.setup();

        return local;
    }

    async reconnect(code: string, id: string): Promise<Client> {
        const host = await this.lipwig.create(this.url, {
            reconnect: {
                code, id
            }
        });
        this.host = host;
        this.setup();


        // Get local client here
        const users = host.getUsers();
        if (!users.length) {
            throw new Error('Users not properly initialized');
        }

        let client: Client | null = null;
        for (const user of users) {
            client = user.getLocalClient();
            if (client) {
                break;
            }
        }

        if (!client) {
            throw new Error('Local users not initialized');
        }

        this.client.setClient(client);

        return client;
    }

    kick(id: string, reason?: string) {
        const user = this.host.getUsers().find(user => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }

        user.kick(reason);
        this.host.sendToAll('chatters', this.getChatters());
    }

    close(reason?: string) {
        this.host.close(reason);
    }

    lock(reason?: string) {
        this.host.lock(reason);
    }

    unlock() {
        this.host.unlock();
    }

    private setup() {
        //this.setPingServerListener();
        this.host.on('joined', (user: User, data: any) => {
            user.send('chatters', this.getChatters());

            //this.setPingListener(user);


            this.host.sendToAllExcept('newChatter', user, data.name, user.id);
        });

        this.host.on('join-request', (request: JoinRequest, data: {[key: string]: any}) => {
            const name = data['name'];
            if (this.host.getUsers().some(user => user.data['name'] === name)) {
                request.reject(`User with name '${name}' already in room`);
            } else {
                request.approve();
            }
        });

        this.host.on('client-reconnected', (user: User) => {
            user.send('chatters', this.getChatters());
            console.log(user.id, 'reconnected');
        });

        this.host.on('reconnected', (users: User[]) => {
            console.log('host reconnected', users);
        });

        this.host.on('disconnected', () => {
            console.log('disconnected');
        });

        this.host.on('client-disconnected', (user: User) => {
            if (!user) {
                //TODO: Add websocket close reason or better way to handle this generally
                return;
            }
            console.log(user.id, 'disconnected');
        });

        this.host.on('message', (user: User, message: string) => {
            const name: string = user.data['name'];
            this.host.sendToAll('message', name, message);
        });
        this.host.on('left', (user: User, reason?: string) => {
            const name = user.data['name'];
            this.host.sendToAll('chatters', this.getChatters());

            this.host.sendToAll('left', name, reason);
        });
    }

    private getChatters(): Chatter[] {
        return this.host.getUsers().map(user => {
            const name: string = user.data['name'];
            return {
                name,
                id: user.id,
            }
        });
    }

    private setPingServerListener() {
        this.host.ping().then(ping => {
            console.debug('Ping to server:', ping);
            setTimeout(() => {
                this.setPingServerListener();
            }, 1000);
        });
    }

    private setPingListener(user: User) {
        user.ping().then(ping => {
            console.debug(`Ping to ${user.id}:`, ping);
            user.data['ping'] = ping;
            setTimeout(() => {
                this.setPingListener(user);
            }, 1000);
        });
    }

    getUser(id: string) {
        return this.host.getUser(id);
    }
}
