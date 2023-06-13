import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { CommonModule } from '@angular/common';
import { NameInputComponent } from './name-input/name-input.component';
import { MessagesComponent } from './messages/messages.component';
import { UserListComponent } from './user-list/user-list.component';
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
        RoomComponent,
        NameInputComponent,
        MessagesComponent,
        UserListComponent,
        LocalComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
