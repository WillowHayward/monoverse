import { Component } from '@angular/core';
import { LipwigService } from '@lipwig/angular';

@Component({
    selector: 'lwh-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'lipwig-hub';

    constructor(lipwig: LipwigService) {
        lipwig.setUrl('wss://lipwig.next.whc.fyi');
    }
}
