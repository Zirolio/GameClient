import { Vector2 } from "ver/Vector2";

import { NetData } from "../types/netData";
import Camera from "../rendering/camera";
import CanvasContext from "../utils/context";


export default abstract class Entity {
    readonly id: number;

    protected $ctx: CanvasContext;

    protected $position: Vector2;
    get position() { return this.$position }
    get x() { return this.$position.x; }
    get y() { return this.$position.y; }

    protected $lightRadius: number = 0;
    get lightRadius() { return this.$lightRadius }

    protected $isDestroyed: boolean = false;
    get isDestroyed() { return this.$isDestroyed }

    protected $isDestroyedByServer: boolean = false;
    get isDestroyedByServer() { return this.$isDestroyedByServer }

    constructor(position: Vector2, id: number, ctx: CanvasContext) {
        this.id = id;
        this.$ctx = ctx;
        this.$position = position.new();
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
    protected abstract drawProcess(scenePosition: Vector2, ctx: CanvasContext, camera: Camera): void;
    public abstract updateByServer(data: NetData): void;
}
