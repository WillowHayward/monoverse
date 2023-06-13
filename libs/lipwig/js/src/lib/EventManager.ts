import * as Events from 'events';

export class EventManager {
    protected events: Events;

    constructor() {
        this.events = new Events();

    }

    public on(eventName: string, listener: ((...args: any[]) => void)) {
        this.events.on(eventName, listener);
    }

    public once(eventName: string, listener: ((...args: any[]) => void)) {
        this.events.once(eventName, listener);
    }

    public emit(eventName: string, ...args: any[]) {
        this.events.emit(eventName, ...args);
    }
}
