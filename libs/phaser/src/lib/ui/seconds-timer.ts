import { GameObjects } from 'phaser';
import { Scene } from '../scene';

export class SecondsTimer extends GameObjects.Text {
    private remaining: number;
    constructor(scene: Scene, x: number, y: number, duration: number, style: Partial<GameObjects.TextStyle>, private prefix: string = '') {
        super(scene, x, y, `${prefix}${duration.toString()}`, style);
        this.remaining = duration;
        /* BUG: TimerEvent isn't working
         * this.timer = new Time.TimerEvent({
            delay: 1000,
            //repeat: duration,
            callback,
        });*/
        this.setTimer();
    }

    private setTimer() {
        setTimeout(() => {
            this.tick();
        }, 1000);
    }

    private tick() {
        this.remaining--;
        console.log('tick', this.remaining);

        this.setText(`${this.prefix}${this.remaining.toString()}`);

        if (this.remaining > 0) {
            this.setTimer();
        } else {
            this.emit('done');
        }
    }
}
