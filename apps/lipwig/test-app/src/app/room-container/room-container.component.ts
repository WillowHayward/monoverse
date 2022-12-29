import { Input, Component, OnInit } from '@angular/core';
import { Host, Client } from '@willhaycode/lipwig/js';

@Component({
    selector: 'lwt-room-container',
    templateUrl: './room-container.component.html',
    styleUrls: ['./room-container.component.scss'],
})
export class RoomContainerComponent implements OnInit {
    @Input() host: Host;
    @Input() server: string;
    code: string = '';

    clients: Client[] = [];

    ngOnInit(): void {
        this.host.on('created', (code: string) => {
            this.code = code;
        });
    }

    join(): void {
        const client = new Client(this.server, this.code);
        this.clients.push(client);
    }
}
