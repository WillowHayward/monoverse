import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { TextInputComponent } from './text-input/text-input.component';
import { LabelComponent } from './label/label.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ButtonComponent,
    TextInputComponent,
    LabelComponent
  ],
  exports: [
    ButtonComponent,
    TextInputComponent,
    LabelComponent
  ],
})
export class UiModule {}
