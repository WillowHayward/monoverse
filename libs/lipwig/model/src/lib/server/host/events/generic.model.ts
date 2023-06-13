// Generic Server -> Host events
import { SERVER_HOST_EVENT } from "../common.model";
import { ERROR_CODE } from "../../../common.model";
import { EventStructure } from "./structure.model";

export interface Error extends EventStructure {
    event: SERVER_HOST_EVENT.ERROR;
    data: ErrorData;
}

export interface ErrorData {
    error: ERROR_CODE;
    message?: string;
}

