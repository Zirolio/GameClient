import Vec2 from "./vec2";

interface CircleLight {
    type: 'circle';
    position: Vec2;
    radius: number;
}

interface ConicLight {
    type: 'conic';
    position: Vec2;
    angle: number;
    distance: number;
    scattering: number;
}