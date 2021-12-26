import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { LandingComponent } from './landing/landing.component';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';

import { UiModule } from '@monoverse/ui';


@NgModule({
  declarations: [AppComponent, LobbyComponent, LandingComponent, CreateComponent, JoinComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    UiModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
