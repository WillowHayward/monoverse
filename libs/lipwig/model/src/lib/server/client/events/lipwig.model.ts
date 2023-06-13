import { UserOptions } from "../../../common.model";
import { SERVER_CLIENT_EVENT } from "../common.model";
import { EventStructure } from "./structure.model";

// Server -> Client events specific to Lipwig functionality
export interface Joined extends EventStructure {
    event: SERVER_CLIENT_EVENT.JOINED;
    data: JoinedData;
}

export interface JoinedData {
    id: string;
    options?: UserOptions;
}

export interface Message extends EventStructure {
    event: SERVER_CLIENT_EVENT.MESSAGE;
    data: MessageData;
}

export interface MessageData {
    event: string;
    args: unknown[];
}

