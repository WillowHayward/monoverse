import { Sprite } from './Sprite';

export type SpriteData = {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
}

type JSONMap = {[path: string]: any};
type SpriteMap = {[path: string]: Sprite};
type SheetMap = {[path: string]: CanvasImageSource};
export class Loader {
    private static instance: Loader | null;
    private jsons: JSONMap = {};
    private sprites: SpriteMap = {};
    private sheets: SheetMap = {};
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
        }).then(json => {
            this.jsons[path] = json;
            return json;
        });
    }

    public static async getImage(path: string): Promise<Sprite> {
        const loader = Loader.getInstance();
        return loader.loadImage(path);
    }

    private async loadImage(path: string): Promise<Sprite> {
        return new Promise(resolve => {
            const existing = this.sprites[path];
            if (existing) {
                resolve(existing);
            }

            const img = new Image();
            img.onload = () => {
                const sprite = new Sprite(img);
                this.sprites[path] = sprite;
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
        return new Promise<CanvasImageSource>(resolve => {
            const existing = this.sheets[path];
            if (existing) {
                resolve(existing);
            }
            const img = new Image();
            img.onload = () => {
                this.sheets[path] = img;
                resolve(img);
            }
            img.src = `assets/${path}`;
        }).then((img: CanvasImageSource) => {
            const sprites = [];
            for (const position of positions) {
                const existing = this.sprites[position.name];
                if (existing) {
                    sprites.push(existing);
                    continue;
                }
                const sprite = new Sprite(img, position.x, position.y, position.width, position.height);
                this.sprites[position.name] = sprite;
                sprites.push(sprite);
            }
            return sprites;
        });
    }
}
