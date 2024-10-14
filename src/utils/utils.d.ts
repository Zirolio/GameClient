import { Vector2 } from "ver/Vector2";

interface CircleLight {
    type: 'circle';
    position: Vector2;
    radius: number;
}

interface ConicLight {
    type: 'conic';
    position: Vector2;
    angle: number;
    distance: number;
    scattering: number;
}
