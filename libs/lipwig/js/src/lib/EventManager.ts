import { EventEmitter } from 'events';

export class EventManager {
    protected events: EventEmitter;

    constructor() {
        this.events = new EventEmitter();
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
