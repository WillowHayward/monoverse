import { SERVER_CLIENT_EVENT, ERROR_CODE, ServerClientEvents, ServerHostEvents } from '@whc/lipwig/model';

//TODO: Account for ServerClientEvents and ServerHostEvents split
export function sendError(
    error: ERROR_CODE,
    message?: string
) {
    const errorMessage: ServerClientEvents.Error = {
        event: SERVER_CLIENT_EVENT.ERROR,
        data: {
            error,
            message,
        },
    };
    this.send(JSON.stringify(errorMessage));
}

export function sendMessage(message: ServerHostEvents.Event | ServerClientEvents.Event) {
    const messageString = JSON.stringify(message);
    this.send(messageString);
}
