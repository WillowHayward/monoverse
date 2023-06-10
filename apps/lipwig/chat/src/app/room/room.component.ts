import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { HostService } from '../host.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    pending: boolean = true;
    private name: string;


    constructor(private lipwig: LipwigService, private host: HostService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.params.subscribe((data) => {
            this.code = data['code'];
            if (this.lipwig.connected) {
                this.pending = false;
                this.connected = true;
                this.initClient();
            } else {
                this.attemptReconnect();
            }
        });
    }

    attemptReconnect() {
        const name = window.sessionStorage.getItem('name');
        const code = window.sessionStorage.getItem('code');
        const id = window.sessionStorage.getItem('id');
        const isHost = window.sessionStorage.getItem('host') === 'true' ? true : false;
        
        if (name && code === this.code && id) {
            if (isHost) {
                this.lipwig.createRoom(name, { code, id }).then(client => {
                    this.pending = false;
                    this.connected = true;
                    this.initClient();
                }).catch(() => {
                    this.pending = false;
                });
            } else {
                this.lipwig.joinRoom(name, code, id).then(client => {
                    this.pending = false;
                    this.connected = true;
                    this.initClient();
                }).catch((err) => {
                    this.pending = false;
                });

            }
        } else {
            this.pending = false;
        }
    }

    connect() {
        const name = this.nameInput.name;
        this.lipwig.joinRoom(name, this.code).then(client => {
            this.connected = true;
            this.initClient();
        }).catch(err => {
            this.router.navigate(['/']);
        });
    }

    initClient() {
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
