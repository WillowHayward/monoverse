import { Component, Output } from '@angular/core';

@Component({
    selector: 'lwc-name-input',
    templateUrl: './name-input.component.html',
    styleUrls: ['./name-input.component.scss'],
})
export class NameInputComponent {
    @Output() name = '';
}
