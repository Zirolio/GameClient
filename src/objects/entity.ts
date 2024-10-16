import { Vector2 } from "ver/Vector2";


export default abstract class Entity {
    readonly id!: number;

    protected _isDestroyed: boolean = false;
    get isDestroyed() { return this._isDestroyed }

    protected _isDestroyedByServer: boolean = false;
    get isDestroyedByServer() { return this._isDestroyedByServer }
}
