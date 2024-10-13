import { gsap } from "gsap";
import Cameras from "../../rendering/camera";
import CanvasContext from "../../utils/context";
import Vec2, { Vec2Like } from "../../utils/vec2";

export default class Trail {
    private $ctx: CanvasContext;
    private $config: TrailConfig;

    private $isStopped: boolean = false;
    get isStopped() { return this.$isStopped }
    private $stopTween?: gsap.core.Tween;
    start() {
        if (this.$isStopped) {
            if (this.$stopTween) this.$stopTween.kill();
            this.$isStopped = false;
        }
    }
    stop(time: number = 0.5) {
        if (!this.$isStopped) {
            if (this.$stopTween) this.$stopTween.kill();
            this.$isStopped = true;
    
            this.$stopTween = gsap.to(this, {
                $length: 0,
                $globalAlptha: 0,
                duration: time,
                ease: "power1.inOut"
            });
        }
    }

    private $globalAlptha: number = 1;

    private $angle: number = 0;

    private $length: number = 0;
    get length() { return this.$length }
    /* get length() { return this.$length; }
    set length(length: number) { this.$length = length; }
    setLength(length: number) { this.$length = length; } */

    private $follow: Vec2Like;
    set follow(follow: Vec2Like) { this.$follow = follow; }
    get follow() { return this.$follow; }
    setFollow(follow: Vec2Like) { this.$follow = follow; return this; }

    private $lastPosition: Vec2;

    constructor(follow: Vec2Like, config: TrailConfig, ctx: CanvasContext) {
        this.$ctx = ctx;
        this.$config = config;
        this.$follow = follow;
        this.$lastPosition = new Vec2(this.$follow);
    }

    update() {
        if (this.$lastPosition.x !== this.$follow.x || this.$lastPosition.y !== this.$follow.y) {
            this.$angle = this.$lastPosition.angle(this.$follow);
        }
        
        // if (this.isStopped && this.$length > 0) this.$length = Math.max(this.$length - 5, 0);
        if (!this.isStopped && this.$length < this.$config.length) this.$length = Math.min(this.$length + new Vec2(this.$follow).subLocal(this.$lastPosition).length(), this.$config.length);

        this.$lastPosition.set(this.$follow);
    }

    draw(camera: Cameras): void;
    draw(camera: Cameras, ctx: CanvasContext): void;
    draw(camera: Cameras, ctx: CanvasContext = this.$ctx) {
        ctx.save();
        ctx.beginPath();

        ctx.lineStyle(this.$config.width, 'round');
        ctx.globalAlpha = this.$globalAlptha;

        const cameraPointStart = camera.getPointPosition(new Vec2(this.$follow));
        const endPoint = cameraPointStart.sub(Vec2.fromAngle(this.$angle).mulLocal(this.$length));

        ctx.strokeStyle = ctx.createLinearGradient(cameraPointStart, endPoint);
        ctx.strokeStyle.addColorStop(0, this.$config.startColor);
        ctx.strokeStyle.addColorStop(1, this.$config.endColor);

        ctx.moveTo(cameraPointStart.x, cameraPointStart.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        
        ctx.restore();
    }
}
/* if (this.$points.length > 1) {
    let startPoint = this.$points[0], lastAngle = startPoint.angle(this.$points[1]);
    for (let startI = 1; startI < this.$points.length - 1; startI++) {
        if (startI == this.$points.length - 2 || this.$points[startI].angle(this.$points[startI + 1]) !== lastAngle) {
            const cameraPointStart = camera.getPointPosition(startPoint);
            const cameraPointEnd = camera.getPointPosition(this.$points[startI]);
            
            ctx.strokeStyle = ctx.createLinearGradient(cameraPointStart, cameraPointEnd, [
                { offset: 1, color: this.$config.startColor },
                { offset: 0, color: this.$config.endColor },
            ]);
            ctx.drawLine(cameraPointStart, cameraPointEnd);
            
            startPoint = this.$points[startI], lastAngle = startPoint.angle(this.$points[startI + 1]);
        }
    }
} */
/* ctx.strokeStyle = 'blue';  // Цвет линии
ctx.lineWidth = 5;         // Толщина линии
ctx.lineJoin = 'round';     // Закругленные углы
ctx.lineCap = 'round';      // Закругленные концы */

/* const cameraPointStart = camera.getPointPosition(this.$points[startI - 1]);
const cameraPointEnd = camera.getPointPosition(this.$points[startI]);
ctx.save();

ctx.lineWidth = 4;
ctx.strokeStyle = 'red'
ctx.strokeStyle = ctx.createLinearGradient(cameraPointStart.x, cameraPointStart.y, cameraPointEnd.x, cameraPointEnd.y);
ctx.strokeStyle.addColorStop(0, this.$config.startColor);
ctx.strokeStyle.addColorStop(1, this.$config.endColor);

ctx.beginPath();
ctx.moveTo(cameraPointStart.x, cameraPointStart.y);
ctx.lineTo(cameraPointEnd.x, cameraPointEnd.y);
ctx.stroke();

ctx.restore(); */