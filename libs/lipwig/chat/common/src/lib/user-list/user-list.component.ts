import { Component, Input, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Chatter } from '../chat.model';
import { HostService } from '../host.service';

@Component({
    selector: 'lwc-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    @Input() isHost = false;

    chatters: Chatter[] = [];
    
    constructor(private client: ClientService, private host: HostService) { }

    ngOnInit(): void {
        this.client.getChatters().subscribe(chatters => {
            this.chatters = chatters;
        });
    }

    kick(id: string) {
        const reason = 'Ya done';
        this.host.kick(id, reason);
    }
}
