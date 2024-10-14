import { Vector2 } from "ver/Vector2";
import { loadImage } from "ver/helpers";

import CanvasContext from "./context";


export default class Texture {
    private $offset: Vector2 = new Vector2(0, 0);
    public get offset() { return this.$offset; };

    private $anchor: Vector2 = new Vector2(0, 0);
	public get anchor() { return this.$anchor; };

    private $scale: Vector2 = new Vector2(1, 1);
	public get scale() { return this.$anchor; };

    constructor(private $image: HTMLImageElement) {}

    draw(position: Vector2, ctx: CanvasRenderingContext2D) {
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

    static fromUrl = loadImage;
}
