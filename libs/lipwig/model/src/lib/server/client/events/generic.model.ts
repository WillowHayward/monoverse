import { ERROR_CODE } from "../../../common.model";
import { SERVER_CLIENT_EVENT } from "../common.model";
import { EventStructure } from "./structure.model";

// Generic Server -> Client events
export interface Error extends EventStructure {
    event: SERVER_CLIENT_EVENT.ERROR;
    data: ErrorData;
}

export interface ErrorData {
    error: ERROR_CODE;
    message?: string;
}

