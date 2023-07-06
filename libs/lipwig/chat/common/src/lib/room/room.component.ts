import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService } from '@lipwig/angular';
import { HostService } from '../host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NameInputComponent } from '../name-input/name-input.component';
import { ClientService } from '../client.service';
import { Reconnectable } from '../chat.model';

enum RoomState {
    LOADING,
    NAME_REQUIRED,
    CONNECTED
}

@Component({
    selector: 'lwc-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    @ViewChild('name') nameInput: NameInputComponent;
    code: string;

    isHost = false;
    locked = false;

    RoomState = RoomState;
    state: RoomState = RoomState.LOADING;

    constructor(private lipwig: LipwigService, private host: HostService, private client: ClientService, private route: ActivatedRoute, private router: Router) {
        const initClient = this.lipwig.getClient();
        if (!initClient) {
            throw new Error('willow one day this will be your problem to deal with');
        }
        this.client.setClient(initClient);
    }

    ngOnInit(): void {
        this.route.params.subscribe((data) => {
            this.code = data['code'];
            if (this.lipwig.connected) {
                this.state = RoomState.CONNECTED;
                this.isHost = this.lipwig.getHost() !== undefined;
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
            let target: Reconnectable;
            if (isHost) {
                target = this.host;
            } else {
                target = this.client;
            }

            target.reconnect(name, code, id).then(() => {
                this.state = RoomState.CONNECTED;
                this.isHost = this.lipwig.getHost() !== undefined;
            }).catch(() => {
                this.state = RoomState.NAME_REQUIRED;
            });
        } else {
            this.state = RoomState.NAME_REQUIRED;
        }
    }

    connect() {
        this.client.connect(this.nameInput.name, this.code).then(() => {
            this.state = RoomState.CONNECTED;
        });
    }

    close() {
        this.host.close('Room done now');
        this.router.navigate(['/']);
    }

    lock() {
        this.locked = true;
        this.host.lock('Keep \'em out');
    }

    unlock() {
        this.locked = false;
        this.host.unlock();
    }

    leave() {
        this.client.leave('Done here');
        this.router.navigate(['/']);
    }
}
