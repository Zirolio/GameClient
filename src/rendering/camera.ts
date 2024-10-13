import Vec2, { Vec2Like } from "../utils/vec2";

export default class Camera {
    private $ctx: CanvasRenderingContext2D;

    private $follow?: Vec2Like;

    private $position: Vec2;
    get position() { return this.$follow ? this.$position.set(this.$follow) : this.$position; }

    constructor(ctx: CanvasRenderingContext2D) {
        this.$ctx = ctx;
        this.$position = new Vec2(0, 0);
    }

    getPointPosition(point: Vec2) {
        return point.sub(this.position).add(this.$ctx.canvas.width / 2, this.$ctx.canvas.height / 2);
    }

    /* setContextCenter(ctx: CanvasRenderingContext2D) {
        const translate = this.position.add(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.translate(translate.x, translate.y);
    } */

    startFollow(object: Vec2Like) { this.$follow = object; }
    stopFollow() { this.$follow = undefined; }
}