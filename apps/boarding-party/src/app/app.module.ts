import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UiModule } from '@willhaycode/ui';

import { LobbyComponent } from './lobby/lobby.component';
import { LandingComponent } from './landing/landing.component';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';

import { PlayerDetailsComponent } from './player-details/player-details.component';

@NgModule({
    declarations: [
        AppComponent,
        LobbyComponent,
        LandingComponent,
        CreateComponent,
        JoinComponent,
        PlayerDetailsComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: LandingComponent,
                },
                {
                    path: 'create',
                    component: CreateComponent,
                },
                {
                    path: 'join/:code',
                    component: JoinComponent,
                },
                {
                    path: 'lobby',
                    component: LobbyComponent,
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
