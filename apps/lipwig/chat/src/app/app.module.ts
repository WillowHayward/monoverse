import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LipwigChatCommonModule, RoomComponent } from '@whc/lipwig/chat/common';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CommonModule } from '@angular/common';
import { LocalComponent } from './local/local.component';

const routes: Routes = [
    {
        path: '',
        component: LobbyComponent,
    },
    {
        path: 'local',
        component: LocalComponent
    },
    {
        path: ':code',
        component: RoomComponent,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        LobbyComponent,
        LocalComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        LipwigChatCommonModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
