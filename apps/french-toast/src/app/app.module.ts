import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';

@NgModule({
    declarations: [AppComponent, GameComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: GameComponent,
                },
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
