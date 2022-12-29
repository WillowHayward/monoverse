import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UiModule } from '@whc/ui';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { GameComponent } from './game/game.component';

@NgModule({
    declarations: [AppComponent, LandingComponent, GameComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    //component: LandingComponent
                    component: GameComponent,
                },
                {
                    path: 'play',
                    component: GameComponent,
                },
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
        UiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
