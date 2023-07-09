import { Component, OnInit, ViewChild } from '@angular/core';
import { LipwigService, LazyLoaderService } from '@lipwig/angular';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'lwh-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {
    @ViewChild('joinForm', { static: true }) joinForm: NgForm;
    canJoin = false;
    roomInfo?: string;
    join = {
        name: '',
        code: ''
    }

    constructor(private lipwig: LipwigService, private lazy: LazyLoaderService) {
        lazy.register('rock-off', 'Rock Off', () => import('@whc/rock-off/client').then(mod => mod.rockOffClientRoutes));
    }

    ngOnInit(): void {
        this.joinForm.valueChanges?.subscribe(value => {
            if (!value.code) {
                return;
            }

            if (value.code.length === 4) {
                this.lipwig.query(value.code).then(response => {
                    if (response.room !== value.code) {
                        // Query for another code
                        return;
                    }

                    if (!response.exists) {
                        this.roomInfo = 'Room Not Found';
                        return;
                    }

                    if (!response.name) {
                        this.roomInfo = 'Unrecognized Room Name';
                        return;
                    }

                    const appName = this.lazy.getAppName(response.name);

                    if (response.locked) {
                        this.roomInfo = `${appName} (${response.lockReason ?? 'Cannot Join Room'})`;
                        return;
                    }

                    if (response.capacity === 0) {
                        this.roomInfo = `${appName} (Room Full)`;
                        return;
                    }

                    this.roomInfo = appName;
                    this.lazy.preload(response.name);
                    if (value.name && value.name.length > 0 && value.name.length < 13) {
                        this.canJoin = true;
                    }
                });
            } else {
                this.roomInfo = undefined;
                this.canJoin = false;
            }
        });
    }


    onJoin() {
        console.log(this.join);
        const name = this.join.name;
        const code = this.join.code;
        this.lipwig.join(code, {
            data: {
                name
            }
        }).then(() => {
            this.lazy.navigate(code);
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
