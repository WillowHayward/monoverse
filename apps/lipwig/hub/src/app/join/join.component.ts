import { Component } from '@angular/core';
import { LipwigService } from '@whc/lipwig/angular';
import { LazyLoaderService } from '../lazy-loader.service';

@Component({
    selector: 'lwh-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss'],
})
export class JoinComponent {
    canJoin: boolean = true;
    join = {
        name: '',
        code: ''
    }

    constructor(private lipwig: LipwigService, private lazy: LazyLoaderService) { }

    onJoin() {
        const lwHost = 'ws://localhost:8989';
        console.log(this.join);
        const url = lwHost;
        const name = this.join.name;
        const code = this.join.code;
        this.lipwig.join(url, code, {
            data: {
                name
            }
        }).then(client => {
            const roomName = client.roomName;
                console.log(roomName);
            this.lazy.navigate(code, roomName);
        }).catch(() => {
            alert('Could not join room');
        });
    }

    private setSessionData(
        name: string,
        code: string,
        id: string,
        isHost: boolean
    ) {
        window.sessionStorage.setItem('name', name);
        window.sessionStorage.setItem('code', code);
        window.sessionStorage.setItem('id', id);

        const host = isHost ? 'true' : 'false';
        window.sessionStorage.setItem('host', host);
    }
}
