import { Injectable } from '@angular/core';
import { Client } from '@lipwig/js';
import { Observable } from 'rxjs';
import { Chatter, Reconnectable } from './chat.model';
import { LipwigService } from '@lipwig/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements Reconnectable {
    private client: Client;
    private chatters: Chatter[] = [];
    //private url = window.env['LIPWIG_HOST'];
    private url = 'ws://localhost:8989';

    constructor(private lipwig: LipwigService, private router: Router) { }

    setClient(client: Client) {
        this.client = client;
        this.setup(client);
    }

    async connect(name: string, code: string): Promise<Client> {
        const client = await this.lipwig.join(this.url, code, {
            data: { name }
        });
        this.setClient(client);

        return client;
    }

    async reconnect(code: string, id: string): Promise<Client> {
        const client = await this.lipwig.join(this.url, code, {
            reconnect: id
        });
        this.setClient(client);

        return client;
    }

    getMessages(): Observable<string> {
        return new Observable(observer => {
            this.client.on('message', (name, message) => {
                observer.next(`${name}: ${message}`);
            });

            this.client.on('left', (name: string, reason?: string) => {
                observer.next(`${name} left. Reason: ${reason}`);
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

    leave(reason?: string) {
        this.client.leave(reason);
    }

    private setup(client: Client) {
        this.client = client;
        //this.setPingListener();
        //this.setPingServerListener();
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
    private setPingListener() {
        this.client.ping().then(ping => {
            console.debug('Ping to host:', ping);
            setTimeout(() => {
                this.setPingListener();
            }, 1000);
        });
    }


    private setPingServerListener() {
        this.client.ping(false).then(ping => {
            console.debug('Ping to server:', ping);
            setTimeout(() => {
                this.setPingServerListener();
            }, 1000);
        });
    }

}
