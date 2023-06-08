import { Component, OnInit } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { User } from '@whc/lipwig/js';
import { HostService } from '../host.service';

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


    constructor(private lipwig: LipwigService, private host: HostService) { }

    ngOnInit(): void {
        this.code = this.lipwig.code;

        if (this.lipwig.isHost) {
            this.host.setup();
        }

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
        const client = this.lipwig.getClient();
        if (!client) {
            return;
        }

        client.send('message', this.name, text);
    }
}
