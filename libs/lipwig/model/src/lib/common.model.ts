export type RoomOptions = {
    size: number;
    password: string;
    name: string;
    remote: boolean;
    reconnect?: {
        code: string;
        id: string;
    };
};

export type RoomConfig = Partial<RoomOptions>;

export type UserOptions = {
    [index: string]: unknown;
    name?: string;
    reconnect?: string;
};

export enum ERROR_CODE {
    SUCCESS = 'SUCCESS',
    MALFORMED = 'MALFORMED',
    ROOMNOTFOUND = 'ROOMNOTFOUND',
    ROOMFULL = 'ROOMFULL',
    USERNOTFOUND = 'USERNOTFOUND',
    INSUFFICIENTPERMISSIONS = 'INSUFFICIENTPERMISSIONS',
    INCORRECTPASSWORD = 'INCORRECTPASSWORD',
}
