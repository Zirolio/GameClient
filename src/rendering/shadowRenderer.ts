import Camera from "./camera";
import CanvasContext from "../utils/context";
import { CircleLight, ConicLight } from "../utils/utils";
import Vec2, { Vec2Like } from "../utils/vec2";

export default class ShadowRenderer {
    private $ctx: CanvasContext;
    private $shadowCtx: CanvasContext;
    private $camera: Camera;

    constructor(camera: Camera, ctx: CanvasContext) {
        this.$shadowCtx = new CanvasContext();
        this.$camera = camera;
        this.$ctx = ctx;
    }

    private drawCircleLight(point: Vec2Like, radius: number) {
        this.$shadowCtx.save();

        this.$shadowCtx.fillStyle = this.$shadowCtx.createRadialGradient(point, 0, point, radius, [
            { offset: 0, color: "rgba(255, 255, 255, 1)" },
            { offset: 1, color: "rgba(255, 255, 255, 0)" }
        ]);

        this.$shadowCtx.beginPath();
        this.$shadowCtx.moveTo(point.x, point.y);
        this.$shadowCtx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.$shadowCtx.fill();

        this.$shadowCtx.restore();
    }

    private drawConicLight(point: Vec2Like, angle: number, distance: number, scattering: number) {
        this.$shadowCtx.save();

        // Конус
        this.$shadowCtx.fillStyle = this.$shadowCtx.createRadialGradient(point, 0, point, distance, [
            { offset: 0, color: 'rgba(255, 255, 255, 1)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0)' }
        ]);

        this.$shadowCtx.beginPath();
        this.$shadowCtx.moveTo(point.x, point.y);
        this.$shadowCtx.arc(point.x, point.y, distance, angle - scattering / 2, angle + scattering / 2);
        this.$shadowCtx.fill();
    
        // Рассеевание от конуса
        this.$shadowCtx.strokeStyle = this.$shadowCtx.createRadialGradient(point, 0, point, distance, [
            { offset: 0.5, color: 'rgba(255, 255, 255, 0.45)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0)' }
        ]);
        this.$shadowCtx.lineWidth = 2;

        this.$shadowCtx.beginPath();
        this.$shadowCtx.moveTo(point.x, point.y);
        this.$shadowCtx.lineTo(point.x + Math.cos(angle - scattering / 2) * distance, point.y + Math.sin(angle - scattering / 2) * distance);
        this.$shadowCtx.moveTo(point.x, point.y);
        this.$shadowCtx.lineTo(point.x + Math.cos(angle + scattering / 2) * distance, point.y + Math.sin(angle + scattering / 2) * distance);
        this.$shadowCtx.stroke();
    
        this.$shadowCtx.restore();
    }

    renderer(lights: Array<CircleLight | ConicLight>, shadowIntensity: number) {
        this.$shadowCtx.canvas.width = this.$ctx.canvas.width; this.$shadowCtx.canvas.height = this.$ctx.canvas.height;
        this.$shadowCtx.clearRect(0, 0, this.$shadowCtx.canvas.width, this.$shadowCtx.canvas.height);

        for (const light of lights) {
            if (light.type == 'circle') this.drawCircleLight(this.$camera.getPointPosition(light.position), light.radius);
            else if (light.type == 'conic') this.drawConicLight(this.$camera.getPointPosition(light.position), light.angle, light.distance, light.scattering);
        }

        this.$shadowCtx.fillStyle = `rgba(0, 0, 0, ${Math.max(1 - Math.abs(shadowIntensity), 0)})`;
        this.$shadowCtx.fillRect(0, 0, this.$shadowCtx.canvas.width, this.$shadowCtx.canvas.height);

        this.$ctx.globalCompositeOperation = "destination-in";
        this.$ctx.drawImage(this.$shadowCtx.canvas, 0, 0);
        this.$ctx.globalCompositeOperation = "source-over";
    }
}