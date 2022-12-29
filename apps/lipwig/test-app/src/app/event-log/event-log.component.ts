import { Component, Input, OnInit } from '@angular/core';
import { Host, Client, User } from '@willhaycode/lipwig/js';
import { EVENTS_ALL, SERVER_EVENT } from '@willhaycode/lipwig/types';

@Component({
    selector: 'lwt-event-log',
    templateUrl: './event-log.component.html',
    styleUrls: ['./event-log.component.scss'],
})
export class EventLogComponent implements OnInit {
    @Input() user: Host | Client;
    log: string = '';

    ngOnInit(): void {
        for (const event of EVENTS_ALL) {
            this.user.on(event, (...args: unknown[]) => {
                args.pop(); // remove copy of event
                if (event === SERVER_EVENT.JOINED) {
                    if (typeof args[0] !== 'string') {
                        // Replace User object with just the id (for host)
                        const user: User = args.shift() as User;
                        args.unshift(user.id);
                    }
                }

                const argsFormatted = JSON.stringify(args, null, 2);
                const log = `${event}: ${argsFormatted}\n`;
                this.log += log;

            });

        }

        
    }

}
