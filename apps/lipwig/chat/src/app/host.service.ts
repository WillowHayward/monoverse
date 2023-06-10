import { Injectable } from '@angular/core';
import { LipwigService } from './lipwig.service';
import { Host, User } from '@whc/lipwig/js';

@Injectable({
    providedIn: 'root'
})
export class HostService {
    users: string[] = [];

    constructor(private lipwig: LipwigService) { }

    getListeners(host: Host) {
        // TODO: Move the setup() listeners to here.
        // There needs to be some mechanism for assigning these listeners in advance, for the promise-based initialisation
    }

    setup() {
        const host = this.lipwig.getHost();
        if (!host) {
            return;
        }

        
        host.on('joined', (user: User, data: any) => {
            this.users.push(data.name);
            user.send('existingUsers', this.users);

            host.sendToAllExcept('newChatter', user, data.name);
        });

        host.on('host-reconnected', (users: User[]) => {
            console.log('reconnected');
        });

        host.on('reconnected', (user: User) => {
            console.log(user.id, 'reconnected');
            user.send('existingUsers', this.users);
        });

        host.on('host-disconnected', () => {
            console.log('disconnected');
        });

        host.on('disconnected', (user: User) => {
            console.log(user.id, 'disconnected');
        });


        host.on('message', (sender: User, name: string, text: string) => {
            host.sendToAll('message', name, text);
        });

    }
}
