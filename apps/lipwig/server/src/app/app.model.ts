import * as WSSocket from 'ws';
import { LipwigSocket } from '../classes/LipwigSocket';

export declare class WebSocket extends WSSocket {
    socket: LipwigSocket
}

// TODO: Expand beyond 4 letter words?
export const BANNED_WORDS = ['SHIT', 'FUCK', 'CUNT', 'COCK', 'RAPE', 'PISS', 'JIZZ', 'DICK', 'DYKE', 'SHAG', 'POOP', 'SLUT', 'TURD', 'GOOK', 'COON', 'SPIC', 'CRAP', 'HELL', 'WANK', 'MONG', 'TWAT', 'TITS', 'SLAG'];
