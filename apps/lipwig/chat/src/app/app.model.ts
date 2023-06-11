import { Client } from "@whc/lipwig/js";

export interface Message {
    name: string;
    text: string;
}

export interface Chatter {
    name: string;
    id: string;
}

export interface Reconnectable {
    reconnect: (name: string, code: string, id: string) => Promise<Client>;
}
