import { NgModule } from '@angular/core';
import { UiModule } from '@willhaycode/ui';
import { CommonModule } from '@angular/common';
import { CreateCardComponent } from './create-card/create-card.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JoinCardComponent } from './join-card/join-card.component';
import { DetailsCardComponent } from './details-card/details-card.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    CreateCardComponent,
    LandingPageComponent,
    JoinCardComponent,
    DetailsCardComponent
  ],
})
export class LipwigUiModule {}

export {
    LandingPageComponent
}
