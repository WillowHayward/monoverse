import { Component, OnInit } from '@angular/core';
import { Game } from '../../engine/Main';

@Component({
    selector: 'willhaycode-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        new Game('render');
    }
}
