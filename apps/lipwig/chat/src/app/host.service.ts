import { Injectable } from '@angular/core';
import { LipwigService } from './lipwig.service';
import { Client, Host, User } from '@whc/lipwig/js';
import { Chatter, Reconnectable } from './app.model';
import { ClientService } from './client.service';

@Injectable({
    providedIn: 'root'
})
export class HostService implements Reconnectable {
    private host: Host;

    constructor(private lipwig: LipwigService, private client: ClientService) { }

    async connect(name: string): Promise<Client> {
        const host = await this.lipwig.createRoom(name);
        this.host = host;

        const local = host.createLocalClient({
            data: {
                name
            }
        });
        this.client.setClient(local);

        this.setup();

        return local;
    }

    async reconnect(name: string, code: string, id: string): Promise<Client> {
        const host = await this.lipwig.createRoom(name, {
            code, id
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

    private setup() {
        this.host.on('joined', (user: User, data: any) => {
            user.send('chatters', this.getChatters());

            this.host.sendToAllExcept('newChatter', user, data.name, user.id);
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
                id: user.id
            }
        });
    }
}
