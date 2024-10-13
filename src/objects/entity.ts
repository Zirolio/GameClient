import Camera from "../rendering/camera";
import { NetData } from "../types/netData";
import CanvasContext from "../utils/context";
import Vec2, { Vec2Like } from "../utils/vec2";

export default abstract class Entity {
    readonly id: number;

    protected $ctx: CanvasContext;

    protected $position: Vec2;
    get position() { return this.$position }
    get x() { return this.$position.x; }
    get y() { return this.$position.y; }

    protected $lightRadius: number = 0;
    get lightRadius() { return this.$lightRadius }

    protected $isDestroyed: boolean = false;
    get isDestroyed() { return this.$isDestroyed }

    protected $isDestroyedByServer: boolean = false;
    get isDestroyedByServer() { return this.$isDestroyedByServer }

    constructor(position: Vec2Like, id: number, ctx: CanvasContext) {
        this.id = id;
        this.$ctx = ctx;
        this.$position = new Vec2(position);
    }

    public draw(camera: Camera): void;
    public draw(camera: Camera, ctx: CanvasContext): void;
    public draw(camera: Camera, ctx: CanvasContext = this.$ctx) {
        this.update();

        const scenePosition = camera.getPointPosition(this.$position);
        this.$ctx.save();
        this.drawProcess(scenePosition, ctx, camera);
        this.$ctx.restore();
    }

    public abstract update(): void;
    protected abstract drawProcess(scenePosition: Vec2, ctx: CanvasContext, camera: Camera): void;
    public abstract updateByServer(data: NetData): void;
}