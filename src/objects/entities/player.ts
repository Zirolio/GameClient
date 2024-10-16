import { Vector2 } from "ver/Vector2";

import { IPlayerNetData } from "../../types/netData";
import GameObject from "../entity";


export class Player extends GameObject {
    constructor(data: IPlayerNetData) {
        super(Vector2.from(data.position), data.id);
        this.$lightRadius = 100;
    }

    public updateByServer(data: IPlayerNetData): void {
        this.isDestroyedByServer = data.destroyed;

        if(this.isDestroyedByServer) this.isDestroyed = true;
        
        this.position.set(data.position);
    }
}
