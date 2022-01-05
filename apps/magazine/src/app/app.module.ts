import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UiModule } from '@willhaycode/ui';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './header/header.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [AppComponent, LandingPageComponent, HeaderComponent, PreviewComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
        {
            path: '',
            component: LandingPageComponent,
        },
    ], { initialNavigation: 'enabledBlocking' }),
    UiModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
