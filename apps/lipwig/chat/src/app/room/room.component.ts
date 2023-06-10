import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { HostService } from '../host.service';
import { ActivatedRoute } from '@angular/router';
import { NameInputComponent } from '../name-input/name-input.component';

@Component({
    selector: 'lwc-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    @ViewChild('name') nameInput: NameInputComponent;
    code: string;
    users: string[] = [];
    messages: {name: string; text: string}[] = [];
    connected: boolean = false;
    private name: string;


    constructor(private lipwig: LipwigService, private host: HostService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        if (this.lipwig.connected) {
            this.connected = true;
            this.initClient();
        } 
    }

    connect() {
        const name = this.nameInput.name;
        this.route.params.subscribe((data) => {
            const code: string = data['code'];
            this.lipwig.joinRoom(name, code).then(client => {
                this.connected = true;
                this.initClient();
            });
        });

    }

    initClient() {
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
