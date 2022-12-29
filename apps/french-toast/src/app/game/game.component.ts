import { Component, OnInit } from '@angular/core';
import { FrenchToast } from '../../engine/FrenchToast';

@Component({
    selector: 'whc-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        new FrenchToast('ws://localhost:8989');
    }
}
