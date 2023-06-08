import { Component, OnInit } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { User } from '@whc/lipwig/js';

@Component({
    selector: 'lwc-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    code: string;
    users: string[] = [];
    messages: {name: string; text: string}[] = [];
    private name: string;


    constructor(private lipwig: LipwigService) { }

    ngOnInit(): void {
        this.code = this.lipwig.code;

        if (this.lipwig.isHost) {
            this.setupHost();
        } else {
            this.setupClient();
        }
    }

    private setupHost() {
        const host = this.lipwig.getHost();
        if (!host) {
            return;
        }

        this.name = host.config.name ?? host.id;
        this.users.push(this.name);

        host.on('joined', (newUser: User, data: any) => {
            this.users.push(data.name);
            newUser.send('existingUsers', this.users);

            for (const user of host.getUsers()) {
                if (user === newUser) {
                    continue;
                }

                user.send('newChatter', data.name);
            }
        });

        host.on('message', (sender: User, name: string, text: string) => {
            this.messages.push({ name, text});
            for (const user of host.getUsers()) {
                user.send('message', name, text);
            }
        });
    }

    private setupClient() {
        const client = this.lipwig.getClient();

        if (!client) {
            return;
        }

        client.on('existingUsers', (names: string[]) => {
            this.users.push(...names);
            this.name = names.pop() || '';
        });

        client.on('newChatter', (name: string) => {
            this.users.push(name);
        });

        client.on('message', (name: string, text: string) => {
            this.messages.push({ name, text});
        });
    }

    send(text: string) {
        if (this.lipwig.isHost) {
            const host = this.lipwig.getHost();
            if (!host) {
                return;
            }

            for (const user of host.getUsers()) {
                user.send('message', this.name, text);
            }

            this.messages.push({ name: this.name, text });
        } else {
            const client = this.lipwig.getClient();
            if (!client) {
                return;
            }

            client.send('message', this.name, text);
        }
    }
}
