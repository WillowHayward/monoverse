import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'lwc-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
    @ViewChild('name') nameInput: ElementRef<HTMLInputElement>;
    @ViewChild('code') codeInput: ElementRef<HTMLInputElement>;

    create(): void {
        const name = this.nameInput.nativeElement.value;
    }

    join(): void {
        const name = this.nameInput.nativeElement.value;
        const code = this.codeInput.nativeElement.value;
    }
}
