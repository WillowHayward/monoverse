import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { RoomContainerComponent } from './room-container/room-container.component';
import { ClientContainerComponent } from './client-container/client-container.component';

@NgModule({
    declarations: [
        AppComponent,
        ControlPanelComponent,
        RoomContainerComponent,
        ClientContainerComponent,
    ],
    imports: [BrowserModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
