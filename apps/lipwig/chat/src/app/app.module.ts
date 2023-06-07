import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
    {
        path: '',
        component: LobbyComponent,
    },
];

@NgModule({
    declarations: [AppComponent, LobbyComponent, RoomComponent],
    imports: [BrowserModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
