import { Input, Component, OnInit } from '@angular/core';

@Component({
    selector: 'whc-label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
    @Input() for = '';

    constructor() {}

    ngOnInit(): void {}
}
