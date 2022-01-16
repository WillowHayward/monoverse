export class Sprite {
    private image: CanvasImageSource;
    private sx: number;
    private sy: number;
    private sWidth: number;
    private sHeight: number;

    constructor(source: CanvasImageSource);
    constructor(source: CanvasImageSource, sx: number, sy: number,
                sWidth: number, sHeight: number);
    constructor(source: CanvasImageSource, sx: number = 0, sy: number = 0,
                sWidth?: number, sHeight?: number) {
        if (!sWidth || !sHeight) {
            sWidth = <number> source.width;
            sHeight = <number> source.height;
        }

        this.image = source;
        
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void;
    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, width?: number, height?: number): void {
        if (!width) {
            width = this.sWidth;
            height = this.sHeight;
        } else if (!height) { // Scale
            const scale = width;
            width = this.sWidth * scale;
            height = this.sHeight * scale;
        }

        // Centre Sprite
        x -= width / 2;
        y -= height / 2;

        const sData: [number, number, number, number] = [this.sx, this.sy, this.sWidth, this.sHeight];

        ctx.drawImage(this.image, ...sData, x, y, width, height);
    }
}
