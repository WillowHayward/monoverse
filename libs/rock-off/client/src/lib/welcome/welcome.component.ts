import { Component, OnInit } from '@angular/core';
import { RockOffService } from '../rock-off.service';

@Component({
    selector: 'roc-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    name: string = '';

    constructor(private game: RockOffService) { }

    ngOnInit(): void {
        this.name = this.game.name;
    }
}
