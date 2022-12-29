import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UiModule } from '@whc/ui/lib';
import { LipwigUiModule } from '@whc/lipwig/ui';

import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
    declarations: [AppComponent, LandingPageComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: LandingPageComponent,
                },
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
        LipwigUiModule,
        UiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
