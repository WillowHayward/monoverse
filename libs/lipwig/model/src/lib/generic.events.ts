import { GENERIC_EVENT } from "./common.model";

export interface EventStructure {
    event: GENERIC_EVENT;
}

export interface Query extends EventStructure {
    event: GENERIC_EVENT.QUERY;
    data: QueryData;
}

export interface QueryData {
    room: string;
}

export type Event = Query;
export type EventData = QueryData;
