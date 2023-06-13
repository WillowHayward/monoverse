import { Component, OnInit } from '@angular/core';
import { Host, LocalClient, LocalHost, User } from '@whc/lipwig/js';

@Component({
    selector: 'lwc-local',
    templateUrl: './local.component.html',
    styleUrls: ['./local.component.scss'],
})
export class LocalComponent implements OnInit {
    private host: Host;

    logs: string[] = [];

    async ngOnInit(): Promise<void> {
        const room = await this.createHost();

        this.createClient(room);
        this.createClient(room);
        this.createClient(room);

        return new Promise(() => {});
    }

    private createHost(): Promise<string> {
        return new Promise(resolve => {
            const host = new LocalHost();
            this.host = host;

            host.on('created', code => {
                this.logs.push(`[Host] Created ${code}`);
                resolve(code);
            });

            host.on('joined', user => {
                this.logs.push(`[Host] ${user.id} joined`);
                setTimeout(() => {
                    user.send('message', `Hello ${user.id}`);
                }, 2000);
            });

            host.on('message', (user: User, message: string) => {
                this.logs.push(`[Host] Received message '${message}' from ${user.id}`);
            });
        });
    }

    createClient(room: string) {
        const client = new LocalClient(this.host, room);

        client.on('joined', () => {
            this.logs.push(`[Client]${client.id} joined`);
            setTimeout(() => {
                client.send('message', 'Happy to be here');
            }, 1000);
        });

        client.on('message', message => {
            this.logs.push(`[Client] Received message '${message}' from host`);
        });
    }
}
