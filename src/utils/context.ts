import { Vec2Like } from "./vec2";

export default class CanvasContext extends CanvasRenderingContext2D {
    constructor();
    constructor(canvas: HTMLCanvasElement, options?: any);
    constructor(ctx: CanvasRenderingContext2D, options?: any);
    constructor(canvas: CanvasRenderingContext2D, options?: any);
    constructor(ctx?: HTMLCanvasElement | CanvasRenderingContext2D, options?: any);
    constructor(canvas: HTMLCanvasElement | CanvasRenderingContext2D = document.createElement('canvas').getContext('2d')!, options?: any) {
        return Object.setPrototypeOf(canvas instanceof HTMLCanvasElement ? canvas.getContext('2d', options) : canvas, new.target.prototype);
        super();
    }
    
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number, steps: { offset: number; color: string }[]): CanvasGradient;
    createLinearGradient(from: Vec2Like, to: Vec2Like): CanvasGradient;
    createLinearGradient(from: Vec2Like, to: Vec2Like, steps: { offset: number; color: string }[]): CanvasGradient;
    createLinearGradient(x0: Vec2Like | number, y0: Vec2Like | number, x1: { offset: number; color: string }[] | number = [], y1?: number, steps: { offset: number; color: string }[] = []): CanvasGradient {
        const gradient = super.createLinearGradient(
            typeof x0 == 'number' ? (x0 as number) : (x0 as Vec2Like).x,
            typeof x0 == 'number' ? (y0 as number) : (x0 as Vec2Like).y,
            typeof x0 == 'number' ? (x1 as number) : (y0 as Vec2Like).x,
            typeof x0 == 'number' ? (y1 as number) : (y0 as Vec2Like).y
        );

        (typeof x0 == 'number' ? steps : x1 as { offset: number; color: string }[]).forEach(step => gradient.addColorStop(step.offset, step.color));
        return gradient;
    }

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, steps: { offset: number; color: string }[]): CanvasGradient;
    createRadialGradient(from: Vec2Like, fromRadius: number, to: Vec2Like, toRadius: number): CanvasGradient;
    createRadialGradient(from: Vec2Like, fromRadius: number, to: Vec2Like, toRadius: number, steps: { offset: number; color: string }[]): CanvasGradient;
    createRadialGradient(x0: Vec2Like | number, y0: number, r0: Vec2Like | number, x1: number, y1: { offset: number; color: string }[] | number = [], r1?: number, steps: { offset: number; color: string }[] = []): CanvasGradient {
        const gradient = super.createRadialGradient(
            typeof x0 == 'number' ? (x0 as number) : (x0 as Vec2Like).x,
            typeof x0 == 'number' ? (y0 as number) : (x0 as Vec2Like).y,
            typeof x0 == 'number' ? (r0 as number) : y0,
            typeof x0 == 'number' ? (x1 as number) : (r0 as Vec2Like).x,
            typeof x0 == 'number' ? (y1 as number) : (r0 as Vec2Like).y,
            typeof x0 == 'number' ? (r1 as number) : x1
        );

        (typeof x0 == 'number' ? steps : y1 as { offset: number; color: string }[]).forEach(step => gradient.addColorStop(step.offset, step.color));
        return gradient;
    }
    
    drawLine(from: Vec2Like, to: Vec2Like) {
        this.beginPath();
        this.moveTo(from.x, from.y);
        this.lineTo(to.x, to.y);
        this.stroke();
    }
    
    lineStyle(width: number, cap: 'square' | 'round' | 'butt' = 'butt', join: 'round' | 'miter' | 'bevel' = 'bevel') {
        this.lineCap = cap;
        this.lineJoin = join;
        this.lineWidth = width;
    }
    
    textStyle(font: string, xAlign: 'start' | 'end' | 'left' | 'right' | 'center' = 'start', yAlign: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom' = 'alphabetic', drawDirection: 'inherit' | 'rtl' | 'ltr' = 'ltr') {
        this.font = font;
        this.textAlign = xAlign;
        this.textBaseline = yAlign;
        this.direction = drawDirection;
    }

    clear(color?: string) {
        this.save();
        if (typeof color == 'string') this.fillStyle = color, this.fillRect(0, 0, this.canvas.width, this.canvas.height);
        else this.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.restore()
    }
    
    toImage() {
        const image = new Image(this.canvas.width, this.canvas.height);
        image.src = this.canvas.toDataURL();
        /* image.width = this.canvas.width;
        image.height = this.canvas.height */;
        return image;
    }
}