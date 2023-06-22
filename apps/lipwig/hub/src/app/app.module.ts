import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { JoinComponent } from './join/join.component';

@NgModule({
    declarations: [AppComponent, JoinComponent],
    imports: [
        BrowserModule,
        FormsModule,
        //RockOffClientModule,
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking',
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
