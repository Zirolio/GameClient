import { Vector2 } from "ver/Vector2";

import { gsap } from "gsap";
import Camera from "../../rendering/camera";
import { BulletNetData } from "../../types/netData";
import CanvasContext from "../../utils/context";

import Trail from "../effects/trail";
import GameObject from "../entity";


export class Bullet extends GameObject {
    private $movementTween?: gsap.core.Tween;
    private $trail: Trail;

    constructor(data: BulletNetData, ctx: CanvasContext) {
        super(Vector2.from(data.position), data.id, ctx);
        this.$trail = new Trail(this.position, { startColor: 'rgba(200, 200, 200, 1)', endColor: 'rgba(200, 200, 200, 0)', width: 5, trailCap: 'round', length: 80 }, ctx);
    }

    protected drawProcess(scenePosition: Vector2, ctx: CanvasContext, camera: Camera): void {
        this.$trail.draw(camera);
    }

    public updateByServer(data: BulletNetData): void {
        this.$isDestroyedByServer = data.destroyed;

        this.$movementTween = gsap.to(this.$position, {
            x: data.position.x,
            y: data.position.y,
            duration: 0.05,
            ease: "power1.inOut"
        });


        if (this.$isDestroyedByServer) {
            if (!this.$trail.isStopped) this.$trail.stop(0.2);
            if (this.$trail.length == 0) this.$isDestroyed = true;
        }
    }

    public update(): void {
        this.$trail.update();
    }
}
