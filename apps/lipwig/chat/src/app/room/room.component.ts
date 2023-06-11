import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { HostService } from '../host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NameInputComponent } from '../name-input/name-input.component';
import { ClientService } from '../client.service';
import { Reconnectable } from '../app.model';

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

    RoomState = RoomState;
    state: RoomState = RoomState.LOADING;

    constructor(private lipwig: LipwigService, private host: HostService, private client: ClientService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.params.subscribe((data) => {
            this.code = data['code'];
            if (this.lipwig.connected) {
                this.state = RoomState.CONNECTED;
                this.isHost = this.lipwig.isHost;
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

            target.reconnect(name, code, id).then(client => {
                this.state = RoomState.CONNECTED;
                this.isHost = this.lipwig.isHost;
            }).catch(() => {
                this.state = RoomState.NAME_REQUIRED;
            });
        } else {
            this.state = RoomState.NAME_REQUIRED;
        }
    }

    connect() {
        this.client.connect(this.nameInput.name, this.code).then(client => {
            this.state = RoomState.CONNECTED;
        });
    }

    close() {
        this.host.close('Room done now');
        this.router.navigate(['/']);
    }

    leave() {
        this.client.leave('Done here');
        this.router.navigate(['/']);
    }
}
