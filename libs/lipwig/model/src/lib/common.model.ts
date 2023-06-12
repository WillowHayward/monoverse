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
    data?: {
        [index: string]: unknown;
    }
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

// 3000-3999 reserved close codes https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
export enum WEBSOCKET_CLOSE_CODE {
    KICKED = 3400,
    CLOSED = 3401,
    LEFT = 3402,
}

