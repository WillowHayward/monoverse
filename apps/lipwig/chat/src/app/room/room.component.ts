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
    messages: {user: string; text: string}[] = [];

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

        const hostName = host.config.name ?? host.id;
        this.users.push(hostName);

        host.on('joined', (newUser: User, data: any) => {
            this.users.push(data.name);
            newUser.send('existingUsers', this.users);

            for (const user of Object.values(host.getUsers())) {
                if (user === newUser) {
                    continue;
                }

                user.send('newChatter', data.name);
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

        });

        client.on('newChatter', (name: string) => {
            this.users.push(name);
        });
    }

    send() {
        console.log('sent');

    }
}
