import { NgModule } from '@angular/core';
import { UiModule } from '@willhaycode/ui';
import { CommonModule } from '@angular/common';
import { CreateCardComponent } from './create-card/create-card.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    CreateCardComponent,
    LandingPageComponent
  ],
})
export class LipwigUiModule {}

export {
    LandingPageComponent
}
