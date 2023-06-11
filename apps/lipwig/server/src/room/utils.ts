import { ErrorEvent, ERROR_CODE, SERVER_EVENT } from '@whc/lipwig/model';
import { LipwigSocket } from '../app/app.model';

export function sendError(
    user: LipwigSocket,
    error: ERROR_CODE,
    message?: string
) {
    const errorMessage: ErrorEvent = {
        event: SERVER_EVENT.ERROR,
        data: {
            error,
            message,
        },
    };
    user.send(JSON.stringify(errorMessage));
}
