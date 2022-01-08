import { NgModule } from '@angular/core';
import { UiModule } from '@willhaycode/ui';
import { CommonModule } from '@angular/common';
import { CreateCardComponent } from './create-card/create-card.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    CreateCardComponent
  ],
})
export class LipwigUiModule {}
