import { Loader, PreloadData } from './Loader';
export const SPRITE_SCALE = 0.3;
export class Canvas {

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not find canvas');
        }

        ctx.fillStyle = '#89CFF0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const templateVars: {[key:string]: string} = {}

        Loader.getJSON('preload.json').then((preload: PreloadData) => {
            console.log("beginning preload", preload);
            return Loader.preload(preload);
        }).then(() => {
            console.log("preloaded!", Loader.getCache());
            return Loader.getJSON('default.json');
        }).then(defaults => {
            for (const label in defaults) {
                templateVars[label] = defaults[label];
            }

            return Loader.getJSON('parts.json');
        }).then(parts => {
            for (const part of parts) {
                const type = part.type;
                let path = part.path;
                const x = part.x ?? 0;
                const y = part.y ?? 0;
                for (const templateVar in templateVars) {
                    const matchString = `[${templateVar}]`;
                    if (path.includes(matchString)) {
                        const templateVarValue = templateVars[templateVar];
                        path = path.replaceAll(matchString, templateVarValue);
                    }
                }
                Loader.getSprite(path).then(sprite => {
                    sprite.draw(ctx, x, y, SPRITE_SCALE);
                });
            }
        });
    }
}

