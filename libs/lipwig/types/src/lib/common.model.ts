export type RoomOptions = {
    size: number;
    password: string;
    name: string;
    remote: boolean;
};

export type RoomConfig = Partial<RoomOptions>;

export type UserOptions = {
    [index: string]: unknown;
    name: string;
};
