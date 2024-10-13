import CanvasContext from "./context";
import Vec2, { Vec2Like } from "./vec2";

export default class Texture {
    private $image: HTMLImageElement;

    private $offset: Vec2 = new Vec2(0, 0);
    setOffset(offset: Vec2): void;
    setOffset(offsetX: number, offsetY: number): void;
    setOffset(x: Vec2Like | number, y?: number) {
        this.$offset.set(typeof x == 'number' ? x : x.x, typeof x == 'number' ? y! : x.y);
    }

    private $anchor: Vec2 = new Vec2(0, 0);
    setAnchor(anchor: Vec2): void;
    setAnchor(anchorX: number, anchorY?: number): void;
    setAnchor(x: Vec2Like | number, y?: number) {
        this.$anchor.set(typeof x == 'number' ? x : x.x, typeof x == 'number' ? typeof y == 'number' ? y : x : x.y);
    }

    private $scale: Vec2 = new Vec2(1, 1);
    setScale(scale: Vec2): void;
    setScale(scaleX: number, scaleY: number): void;
    setScale(x: Vec2Like | number, y?: number) {
        this.$scale.set(typeof x == 'number' ? x : x.x, typeof x == 'number' ? typeof y == 'number' ? y : x : x.y);
    }

    constructor(image: HTMLImageElement) {
        this.$image = image;
    }

    draw(position: Vec2, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.drawImage(
            this.$image,
            0, 0,
            this.$image.width, this.$image.height,
            position.x + this.$offset.x - this.$image.width * this.$anchor.x * this.$scale.x, position.y + this.$offset.y - this.$image.height * this.$anchor.y * this.$scale.y,
            this.$scale.x * this.$image.width, this.$scale.y * this.$image.height
        );
        ctx.closePath();
    }

    static fromCanvas(ctx: CanvasRenderingContext2D): void;
    static fromCanvas(canvas: HTMLCanvasElement): void;
    static fromCanvas(ctx: HTMLCanvasElement | CanvasRenderingContext2D) {
        if (ctx instanceof HTMLCanvasElement) ctx = ctx.getContext('2d')!;
        return new Texture(new CanvasContext(ctx).toImage());
    }

    static async fromUrl(url: string) {
        const image = new Image();
        image.src = url;
        return await new Promise<HTMLImageElement>(res => {
            image.onload = () => res(image);
        });
    }
}