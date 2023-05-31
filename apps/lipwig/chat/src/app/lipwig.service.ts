import { Injectable } from '@angular/core';
import { Client, Host } from '@whc/lipwig/js';

@Injectable({
  providedIn: 'root'
})
export class LipwigService {

    constructor() { }

    public createRoom(name: string): Host {
        return new Host('ws://localhost:8989', {
            name
        });
    }

    public joinRoom(name: string, code: string): Client {
        return new Client('ws://localhost:8989', code, {
            name
        });
    }
}
