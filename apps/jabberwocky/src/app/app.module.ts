import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UiModule } from '@willhaycode/ui';
import { LipwigUiModule, LandingPageComponent } from '@willhaycode/lipwig-ui';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
        {
            path: '',
            component: LandingPageComponent,
        },
    ], { initialNavigation: 'enabledBlocking' }),
    UiModule,
    LipwigUiModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
