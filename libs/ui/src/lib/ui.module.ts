import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { TextInputComponent } from './text-input/text-input.component';
import { LabelComponent } from './label/label.component';
import { CardComponent } from './card/card.component';
import { CounterComponent } from './counter/counter.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        ButtonComponent,
        TextInputComponent,
        LabelComponent,
        CardComponent,
        CounterComponent,
    ],
    exports: [
        ButtonComponent,
        TextInputComponent,
        LabelComponent,
        CardComponent,
        CounterComponent,
    ],
})
export class UiModule {}
