import { Component, OnInit } from '@angular/core';
import { Ships } from '../../engine/Ships';

@Component({
    selector: 'ships-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        new Ships('render');
    }
}
