import { Vector2 } from "ver/Vector2";

import { NetData } from "../../types/netData";
import { AreaConfig } from "../../socket/types";
import Camera from "../../rendering/camera";
import CanvasContext from "../../utils/context";
import Entity from "../entity";

export default class Area extends Entity {
    private $areaConfig: AreaConfig;

    get width() { return this.$areaConfig.width * 32 + 1; }
    get height() { return this.$areaConfig.height * 32 + 1; }

    constructor(areaConfig: AreaConfig, ctx: CanvasContext) {
        super(new Vector2(areaConfig.x, areaConfig.y), -1, ctx)
        this.$areaConfig = areaConfig;
    }

    protected drawProcess(scenePosition: Vector2, ctx: CanvasContext, camera: Camera): void {
        this.$ctx.fillStyle = "rgb(0, 100, 0)";
        this.$ctx.fillRect(scenePosition.x - this.width / 2 - this.$ctx.canvas.width / 2, scenePosition.y - this.height / 2 - this.$ctx.canvas.height / 2, this.width + this.$ctx.canvas.width, this.height + this.$ctx.canvas.height);
        this.$ctx.fillStyle = "rgb(0, 155, 0)";
        this.$ctx.fillRect(scenePosition.x - this.width / 2, scenePosition.y - this.height / 2, this.width, this.height);
    }

    public update(): void {
        
    }

    public updateByServer(data: NetData): void {
        
    }
}
