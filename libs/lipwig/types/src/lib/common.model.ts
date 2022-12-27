/**
 * @author: WillHayCode
 */

export type MessageData = {
    event?: string;
    args: unknown[];
    recipient: string[];
    sender: string;
}

export interface Message {
    event: string;
    data: MessageData;
}

export enum ErrorCode {
    SUCCESS,
    MALFORMED,
    ROOMNOTFOUND,
    ROOMFULL,
    USERNOTFOUND,
    INSUFFICIENTPERMISSIONS,
    INCORRECTPASSWORD
}

export type RoomOptions = {
    size: number;
    password: string;
    name: string;
    remote: boolean;
};

export type RoomConfig = Partial<RoomOptions>;

export type UserOptions = {
    [index: string]: unknown;
};
