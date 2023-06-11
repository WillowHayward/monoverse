import { Injectable } from '@angular/core';
import { Client } from '@whc/lipwig/js';
import { Observable } from 'rxjs';
import { Chatter, Reconnectable } from './app.model';
import { LipwigService } from './lipwig.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements Reconnectable {
    private client: Client;
    private chatters: Chatter[] = [];

    constructor(private lipwig: LipwigService, private router: Router) { }

    setClient(client: Client) {
        this.client = client;
        this.setup(client);
    }

    async connect(name: string, code: string): Promise<Client> {
        const client = await this.lipwig.joinRoom(name, code);
        this.setClient(client);

        return client;
    }

    async reconnect(name: string, code: string, id: string): Promise<Client> {
        const client = await this.lipwig.joinRoom(name, code, id);
        this.setClient(client);

        return client;
    }

    getMessages(): Observable<[string, string]> {
        return new Observable(observer => {
            this.client.on('message', (...args) => {
                const [name, message] = args;
                observer.next([name, message]);
            });
        });
    }

    getChatters(): Observable<Chatter[]> {
        console.log('Subscribing to chatters');
        return new Observable(observer => {
            this.client.on('chatters', (chatters: Chatter[]) => {
                if (!chatters.length) {
                    throw new Error('No existing users');
                }
                this.chatters = chatters;

                observer.next(chatters);
            });

            this.client.on('newChatter', (name: string, id: string) => {
                this.chatters.push({
                    name,
                    id
                });
                observer.next(this.chatters);
            });
        });
    }

    send(message: string) {
        this.client.send('message', message);
    }

    private setup(client: Client) {
        this.client = client;
        this.client.on('disconnected', () => {
            console.log('disconnected');
        });

        this.client.on('host-disconnected', () => {
            console.log('host disconnected');
        });

        this.client.on('reconnected', () => {
            console.log('reconnected');
        });

        this.client.on('host-reconnected', () => {
            console.log('host reconnected');
        });

        this.client.on('kicked', (reason?: string) => {
            alert(`Kicked. Reason: ${reason}`);
            this.router.navigate(['/']);
        });

        this.client.on('closed', (reason?: string) => {
            alert(`Room closed. Reason: ${reason}`);
            this.router.navigate(['/']);
        });
    }
}
