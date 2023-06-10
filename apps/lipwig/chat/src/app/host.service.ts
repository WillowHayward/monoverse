import { Injectable } from '@angular/core';
import { LipwigService } from './lipwig.service';
import { User } from '@whc/lipwig/js';

@Injectable({
    providedIn: 'root'
})
export class HostService {
    users: string[] = [];

    constructor(private lipwig: LipwigService) { }

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

        host.on('reconnected', (user?: User) => {
            if (user) {
                user.send('existingUsers', this.users);
            } else {
                console.log(host.getUsers());
            }
        });

        host.on('message', (sender: User, name: string, text: string) => {
            host.sendToAll('message', name, text);
        });

    }
}
