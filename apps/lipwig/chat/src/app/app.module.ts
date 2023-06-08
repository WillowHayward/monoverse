import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
        path: '',
        component: LobbyComponent,
    },
    {
        path: 'room', // TODO: Change to :code
        component: RoomComponent
    }
];

@NgModule({
    declarations: [AppComponent, LobbyComponent, RoomComponent],
    imports: [BrowserModule, CommonModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
