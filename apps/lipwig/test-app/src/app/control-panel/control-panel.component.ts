import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Host } from '@lipwig/js';

@Component({
    selector: 'lwt-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent {
    defaultServer: string = "ws://localhost:8989";
    rooms: {
        server: string;
        host: Host;
    }[] = [];

    create(form: NgForm) {
        const server = form.value.url;
        const host = new Host(server);
        this.rooms.push({
            host,
            server
        });
    }
}
