import { Component, ElementRef, ViewChild } from '@angular/core';
import { LipwigService } from '../lipwig.service';
import { Router } from '@angular/router';
import { NameInputComponent } from '../name-input/name-input.component';

@Component({
    selector: 'lwc-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
    @ViewChild('name') nameInput: NameInputComponent;
    @ViewChild('code') codeInput: ElementRef<HTMLInputElement>;

    constructor(private lipwig: LipwigService, private router: Router) {}

    create(): void {
        const name = this.nameInput.name;
        this.lipwig.createRoom(name).then((client) => {
            this.router.navigate([client.room]);
        });
    }

    join(): void {
        const name = this.nameInput.name;
        const code = this.codeInput.nativeElement.value;
        this.lipwig.joinRoom(name, code).then((client) => {
            this.router.navigate([client.room]);
        });
    }
}
