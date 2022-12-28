import { Sprite, SpriteData } from './Sprite';

export type PreloadData = {
    json?: string[];
    sprites?: string[];
    sheets?: string[];
};

type JSONMap = { [path: string]: any };
type SpriteMap = { [path: string]: Sprite };
type SheetMap = { [path: string]: CanvasImageSource };
type Cache = {
    json: JSONMap;
    sprites: SpriteMap;
    sheets: SheetMap;
};
export class Loader {
    private static instance: Loader | null;
    private json: JSONMap = {};
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

    public static getCache(): Cache {
        const loader = Loader.getInstance();
        return loader.retrieveCache();
    }

    private retrieveCache(): Cache {
        return {
            json: this.json,
            sprites: this.sprites,
            sheets: this.sheets,
        };
    }

    public static async preload(data: PreloadData): Promise<any> {
        return new Promise((resolve) => {
            const promises: Promise<any>[] = [];
            if (data.json) {
                for (const path of data.json) {
                    const promise = Loader.getJSON(path);
                    promises.push(promise);
                }
            }
            if (data.sprites) {
                for (const path of data.sprites) {
                    const promise = Loader.getSprite(path);
                    promises.push(promise);
                }
            }
            if (data.sheets) {
                for (const sheet of data.sheets) {
                    const promise = Loader.getSheet(sheet);
                    promises.push(promise);
                }
            }

            resolve(Promise.all(promises));
        });
    }

    public static async getJSON(path: string): Promise<any> {
        const loader = Loader.getInstance();
        return loader.loadJSON(path);
    }

    private async loadJSON(
        path: string,
        prefix: string = 'json'
    ): Promise<any> {
        const existing = this.json[path];
        if (existing) {
            return Promise.resolve(existing);
        }
        return fetch(`assets/${prefix}/${path}`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.json[path] = json;
                return json;
            });
    }

    public static async getSprite(path: string): Promise<Sprite> {
        const loader = Loader.getInstance();
        return loader.loadSprite(path);
    }

    private async loadSprite(path: string): Promise<Sprite> {
        const existing = this.sprites[path];
        if (existing) {
            return Promise.resolve(existing);
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const sprite = new Sprite(img);
                this.sprites[path] = sprite;
                resolve(sprite);
            };
            img.src = `assets/${path}`;
        });
    }

    public static async getSheet(json: string): Promise<Sprite[]>;
    public static async getSheet(
        path: string,
        positions: SpriteData[]
    ): Promise<Sprite[]>;
    public static async getSheet(
        path: string,
        positions?: SpriteData[]
    ): Promise<Sprite[]> {
        const loader = Loader.getInstance();
        if (positions) {
            return loader.loadSheet(path, positions);
        }

        return loader
            .loadJSON(path, 'sheets')
            .then((json) => {
                const promises: Promise<Sprite[]>[] = [];
                for (const path in json) {
                    const positions = json[path];
                    const promise = loader.loadSheet(path, positions);
                    promises.push(promise);
                }
                return Promise.all(promises);
            })
            .then((sheets) => {
                let sprites: Sprite[] = [];
                for (const sheet of sheets) {
                    sprites = sprites.concat(sheet);
                }
                return sprites;
            });
    }

    private async loadSheet(
        path: string,
        positions: SpriteData[]
    ): Promise<Sprite[]> {
        return new Promise<CanvasImageSource>((resolve) => {
            const existing = this.sheets[path];
            if (existing) {
                resolve(existing);
            }
            const img = new Image();
            img.onload = () => {
                this.sheets[path] = img;
                resolve(img);
            };
            img.src = `assets/sheets/${path}`;
        }).then((img: CanvasImageSource) => {
            const sprites = [];
            for (const position of positions) {
                const existing = this.sprites[position.name];
                if (existing) {
                    sprites.push(existing);
                    continue;
                }
                const sprite = new Sprite(
                    img,
                    position.x,
                    position.y,
                    position.width,
                    position.height
                );
                this.sprites[position.name] = sprite;
                sprites.push(sprite);
            }
            return sprites;
        });
    }
}
