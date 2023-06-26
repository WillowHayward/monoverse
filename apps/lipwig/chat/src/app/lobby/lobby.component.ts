import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HostService, ClientService, NameInputComponent } from '@whc/lipwig/chat/common';

@Component({
    selector: 'lwc-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
    @ViewChild('name') nameInput: NameInputComponent;
    @ViewChild('code') codeInput: ElementRef<HTMLInputElement>;

    constructor(private host: HostService, private client: ClientService, private router: Router) {}

    create(): void {
        const name = this.nameInput.name;
        this.host.connect(name).then(client => {
            this.router.navigate([client.room]);
        });
    }

    join(): void {
        const name = this.nameInput.name;
        const code = this.codeInput.nativeElement.value;

        this.client.connect(name, code).then(client => {
            this.router.navigate([code]);
        });
    }
}
