import { Vector2 } from "ver/Vector2";


export default class Camera {
    private $follow: Vector2 | null = null;

    private $position = new Vector2(0, 0);
    get position() { return this.$follow ? this.$position.set(this.$follow) : this.$position; }

    constructor(private $ctx: CanvasRenderingContext2D) {}

    getPointPosition(point: Vector2) {
        return point.sub(this.position).add(this.$ctx.canvas.width / 2, this.$ctx.canvas.height / 2);
    }

    /* setContextCenter(ctx: CanvasRenderingContext2D) {
        const translate = this.position.add(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.translate(translate.x, translate.y);
    } */

    follow(object: Vector2 | null) { this.$follow = object; }
}
