import { SERVER_CLIENT_EVENT, ERROR_CODE, ServerClientEvents } from '@whc/lipwig/model';
import { LipwigSocket } from '../app/app.model';

//TODO: Account for ServerClientEvents and ServerHostEvents split
export function sendError(
    user: LipwigSocket,
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
    user.send(JSON.stringify(errorMessage));
}
