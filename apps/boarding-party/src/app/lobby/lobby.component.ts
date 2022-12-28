import { Input, Component, OnInit } from '@angular/core';

@Component({
    selector: 'bp-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
    @Input() code = '';

    constructor() {}

    ngOnInit(): void {}
}
