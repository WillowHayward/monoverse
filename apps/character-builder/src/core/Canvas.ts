import { Loader, SpriteData } from './Loader';
export const SPRITE_SCALE = 0.3;
export class Canvas {

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not find canvas');
        }

        ctx.fillStyle = '#89CFF0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Loader.getImage('tint1_head.png').then(head => {
            head.draw(ctx, 0, 0, SPRITE_SCALE);
        });

        Loader.getJSON('spritesheets.json').then((spritesheets: any) => {
            console.log(spritesheets);
            for (const path in spritesheets) {
                const spritesheet = spritesheets[path];
                Loader.getSheet(path, spritesheet).then(sprites => {
                    for (const sprite of sprites) {
                        console.log(sprite);
                        sprite.draw(ctx, 0, 0, SPRITE_SCALE);
                    }
                });
            }
        });
    }
}

