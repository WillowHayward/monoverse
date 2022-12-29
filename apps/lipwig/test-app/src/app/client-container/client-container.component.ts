import { Component, Input, OnInit } from '@angular/core';
import { Client } from '@willhaycode/lipwig/js';

@Component({
    selector: 'lwt-client-container',
    templateUrl: './client-container.component.html',
    styleUrls: ['./client-container.component.scss'],
})
export class ClientContainerComponent implements OnInit {
    @Input() client: Client;
    id: string = '';

    ngOnInit(): void {
        this.client.on('joined', (id: string) => {
            this.id = id;
        });
    }

}
