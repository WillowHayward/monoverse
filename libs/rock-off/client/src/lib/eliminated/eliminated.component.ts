import { Component } from '@angular/core';
import { RockOffService } from '../rock-off.service';

@Component({
    selector: 'roc-eliminated',
    templateUrl: './eliminated.component.html',
    styleUrls: ['./eliminated.component.scss'],
})
export class EliminatedComponent {
    name: string = '';

    constructor(private game: RockOffService) { }

    ngOnInit(): void {
        this.name = this.game.name;
    }
}
