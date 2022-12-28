import { Stage } from './Stage';
import { KeyState, MouseState } from './InputState';

export class Input {
    public key: {
        [index: string]: KeyState;
    };
    public mouse: MouseState;

    constructor(stage: Stage) {
        // Init Mouse
        this.mouse = new MouseState(stage);

        // Init Keys
        this.key = {};
        const keys = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Keys to track
        keys.push('shift');
        //TODO: Change this to array (explode), add array for shift/ctrl/etc
        //TODO: Make keys only track when registered or requested for the first time?
        //TODO: Would need to move to to getter function for above
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.key[key] = new KeyState(key);
        }

        window.addEventListener('keyup', (evt: KeyboardEvent) => {
            //TODO: Move to babylon style
            const key = evt.key.toLowerCase();
            const keyState = this.key[key];
            if (keyState) {
                if (keyState.pressed) {
                    // TODO: Are these if statements actually needed? They're on the up/down events anyway
                    keyState.justReleased = true;
                }
                keyState.pressed = false;
                keyState.value = 0;
            }
        });

        window.addEventListener('keydown', (evt: KeyboardEvent) => {
            const key = evt.key.toLowerCase();
            const keyState = this.key[key];
            if (keyState) {
                if (!keyState.pressed) {
                    keyState.justPressed = true;
                }
                keyState.pressed = true;
                keyState.value = 1;
            }
        });
    }

    public tick(delta: number) {
        for (let key in this.key) {
            const keyState = this.key[key];
            keyState.tick(delta);
        }
        this.mouse.tick(delta);
    }
}
