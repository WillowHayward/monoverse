/**
 * @author: WillHayCode
 */

export type MessageData = {
    args: unknown[];
    recipient: string[];
    sender: string;
}

export type Message = {
    event: string;
    data: MessageData;
};

export type DataMap = {
  [key:string]: unknown
};

export const DEFAULTS = {
  port: 8989
};
