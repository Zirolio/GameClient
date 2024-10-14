import { Vector2 } from "ver/Vector2";

import { gsap } from "gsap";
import { PlayerNetData } from "../../types/netData";
import CanvasContext from "../../utils/context";
import Texture from "../../utils/texture";
import GameObject from "../entity";

const playerImageC = new CanvasContext();
playerImageC.canvas.width = 100;
playerImageC.canvas.height = 100;
playerImageC.beginPath();
playerImageC.fillStyle = 'orange';
playerImageC.arc(50, 50, 50, 0, Math.PI * 2);
playerImageC.fill();
playerImageC.getImageData(0, 0, 100, 100);
const playerTexture = new Texture(playerImageC.toImage());
playerTexture.anchor.set(0.5, 0.5);


export class Player extends GameObject {
    private $movementTween?: gsap.core.Tween;

    constructor(data: PlayerNetData, ctx: CanvasContext) {
        super(Vector2.from(data.position), data.id, ctx);
        this.$lightRadius = 100;
    }

    protected drawProcess(position: Vector2, ctx: CanvasContext): void {
        playerTexture.draw(position, ctx);
    }

    public updateByServer(data: PlayerNetData): void {
        this.$isDestroyedByServer = data.destroyed;

        if (this.$movementTween) this.$movementTween.kill();

        this.$movementTween = gsap.to(this.$position, {
            x: data.position.x,
            y: data.position.y,
            duration: 0.05,
            ease: "power1.inOut"
        });

        if (this.$isDestroyedByServer) {
            this.$movementTween.then(() => this.$isDestroyed = true);
        }
        
        // this.$position.set(data.position);
    }

    public update(): void {
    }
}
