import { Component } from '@angular/core';
import { Move } from '@whc/rock-off/common';
import { RockOffService } from '../rock-off.service';

@Component({
    selector: 'roc-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss'],
})
export class PlayComponent {
    readonly Move = Move;

    constructor(private game: RockOffService) {}

    play(move: Move) {
        this.game.play(move);
    }
}
