import type { Client } from "@lipwig/js";

export interface Chatter {
    name: string;
    id: string;
}

export interface Reconnectable {
    reconnect: (name: string, code: string, id: string) => Promise<Client>;
}
