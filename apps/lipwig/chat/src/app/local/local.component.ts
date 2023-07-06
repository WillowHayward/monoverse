import { Component, OnInit } from '@angular/core';
import { Host, LocalClient, LocalHost, User } from '@lipwig/js';

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

        return new Promise(() => null); // TODO: Not sure what this is
    }

    private createHost(): Promise<string> {
        return new Promise(resolve => {
            const host = new LocalHost();
            this.host = host;

            host.on('created', code => {
                this.logs.push(`[Host] Created ${code}`);
                resolve(code);

                host.getGroup('group').on('group-message', (user: User, message: string) => {
                    this.logs.push(`[Host] Received message '${message}' from group member ${user.id}`);
                });
            });

            host.on('joined', (user: User) => {
                this.logs.push(`[Host] ${user.id} joined`);
                setTimeout(() => {
                    user.send('message', `Hello ${user.id}`);
                }, 2000);
                setTimeout(() => {
                    user.assign('group', true);
                }, 3000);
            });

            host.on('message', (user: User, message: string) => {
                this.logs.push(`[Host] Received message '${message}' from ${user.id}`);
            });

            setTimeout(() => {
                host.getGroup('group').send('group-message', 'Hello group');
            }, 4000);
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

        client.on('group-message', message => {
            this.logs.push(`[Client] Received group message '${message}' from host`);
            client.send('group-message', 'Go team');
        });

        client.on('assigned', (group: string) => {
            this.logs.push(`[Client]${client.id} added to group '${group}'`);
        });
    }
}
