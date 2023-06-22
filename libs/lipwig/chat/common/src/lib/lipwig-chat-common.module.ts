import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { NameInputComponent } from './name-input/name-input.component';
import { MessagesComponent } from './messages/messages.component';
import { UserListComponent } from './user-list/user-list.component';
import { HostService } from './host.service';
import { ClientService } from './client.service';
import { FormsModule } from '@angular/forms';
const components = [
    RoomComponent,
    NameInputComponent,
    MessagesComponent,
    UserListComponent,
];
@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [...components],
    providers: [ HostService, ClientService],
    exports: [...components]
})
export class LipwigChatCommonModule {}

