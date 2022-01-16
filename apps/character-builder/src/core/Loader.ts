import { Sprite } from './Sprite';

export type SpriteData = {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
}

type SpriteMap = {[path: string]: Sprite};
export class Loader {
    private static instance: Loader | null;
    private sprites: SpriteMap = {};
    private constructor() {
        Loader.instance = this;
    }

    private static getInstance(): Loader {
        if (Loader.instance) {
            return Loader.instance;
        }

        return new Loader();
    }

    public static async getJSON(path: string): Promise<any> {
        const loader = Loader.getInstance();
        return loader.loadJSON(path);
    }

    private async loadJSON(path: string): Promise<any> {
        return fetch(`assets/${path}`).then(response => {
            return response.json();
        });
    }

    public static async getImage(path: string): Promise<Sprite> {
        const loader = Loader.getInstance();
        return loader.loadImage(path);
    }

    private async loadImage(path: string): Promise<Sprite> {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const sprite = new Sprite(img);
                resolve(sprite);
            }
            img.src = `assets/${path}`;
        });
    }

    public static async getSheet(path: string, positions: SpriteData[]): Promise<Sprite[]> {
        const loader = Loader.getInstance();
        return loader.loadSheet(path, positions);
    }

    private async loadSheet(path: string, positions: SpriteData[]): Promise<Sprite[]> {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const sprites = [];
                for (const position of positions) {
                    const sprite = new Sprite(img, position.x, position.y, position.width, position.height);
                    sprites.push(sprite);
                }
                resolve(sprites);
            }
            img.src = `assets/${path}`;
        });
    }
}
