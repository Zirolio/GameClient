import CanvasContext from "../utils/context";
import Camera from "./camera";

export default abstract class Renderer {
    private lastStep: number = 0;

    protected $ctx: CanvasContext;
    get ctx() { return this.$ctx }

    protected $camera: Camera;
    get camera() { return this.$camera }
    
    protected $isStarted: boolean = false;
    start() {
        if (!this.$isStarted) {
            this.$isStarted = true;
            this.onStart();
            this.tick();
        }
    }
    stop() {
        if (this.$isStarted) {
            this.$isStarted = false;
            this.onStop();
        }
    }

    constructor(ctx?: CanvasRenderingContext2D | HTMLCanvasElement) {
        this.$ctx = new CanvasContext(ctx);
        this.$camera = new Camera(this.$ctx);
    }

    private tick() {
        const tickStart = Date.now();
        // console.log(tickStart - this.lastStep);
        this.lastStep = tickStart;

        if (this.$isStarted) {
            this.onTick();
            // setTimeout(this.tick.bind(this), Math.max(0, 16 - (Date.now() - tickStart)));
            requestAnimationFrame(this.tick.bind(this));
        }
    }

    protected abstract onTick(): void;
    protected abstract onStart(): void;
    protected abstract onStop(): void;
}
