import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
    selector: 'lwc-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
    @ViewChild('message') messageBox: ElementRef<HTMLTextAreaElement>;
    constructor(private client: ClientService) {}
    messages: string[] = [];

    ngOnInit(): void {
        this.client.getMessages().subscribe(message => {
            this.messages.push(message);
        });
    }

    send() {
        const message = this.messageBox.nativeElement.value;
        this.client.send(message);
    }
}
