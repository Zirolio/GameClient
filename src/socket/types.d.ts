import { EntityTypes } from "../types/entityTypes";
import { Vec2Like } from "../utils/vec2";
import { MessagesTypes } from "./messagesTypes";

interface SocketServerMessage {
    type: MessagesTypes;
    data: Object;
}

interface SocketClientMessage {
    type: MessagesTypes;
    data: string;
}

interface AreaConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface GameConfig {
    playerId: number;
    area: AreaConfig;
}

interface Mouse {
    position: Vec2Like;
    shot: boolean;
}

interface Keyboard {
    top: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

interface PlayerInput {
    mouse: Mouse;
    keyboard: Keyboard;
}