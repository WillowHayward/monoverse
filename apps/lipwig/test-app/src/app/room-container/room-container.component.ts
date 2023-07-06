import { Input, Component, OnInit } from '@angular/core';
import { Host, Client, User } from '@lipwig/js';

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
    users: User[] = [];

    ngOnInit(): void {
        this.host.on('created', (code: string) => {
            this.code = code;
        });

        this.host.on('joined', (user: User) => {
            this.users.push(user);
        });
    }

    join(): void {
        const client = new Client(this.server, this.code);
        this.clients.push(client);
    }

    kick(user: User, reason?: string): void {
        user.kick(reason);
    }
}
