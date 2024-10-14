import { Player } from "../objects/entities/player";
import Entity from "../objects/entity";
import { EntityTypes } from "../types/entityTypes";
import Renderer from "../rendering/renderer";
import { GameConfig } from "../socket/types";
import { BulletNetData, NetData, PlayerNetData } from "../types/netData";
import Game from "../game";
import { MessagesTypes } from "../socket";
import InputsController from "../utils/inputsController";
import { Bullet } from "../objects/entities/bullet";
import Area from "../objects/area/area";

export default class GameRenderer extends Renderer {
    private $self?: Player;

    private $sendInputsInterval?: number;
    private $inputsController: InputsController;

    private $game: Game;
    private $gameConfig?: GameConfig;

    private $area?: Area;

    private $entities: Map<number, Entity>;

    constructor(game: Game, ctx?: CanvasRenderingContext2D | HTMLCanvasElement) {
        super(ctx);
        this.$game = game;
        this.$entities = new Map();
        this.$inputsController = new InputsController(this.$ctx.canvas);
        this.init();
    }

    private init() {
        document.body.appendChild(this.ctx.canvas);
        this.ctx.canvas.width = window.innerWidth; this.ctx.canvas.height = window.innerHeight;
        this.ctx.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    onGameConfig(gameConfig: GameConfig) {
        this.$gameConfig = gameConfig;
        this.$area = new Area(gameConfig.area, this.$ctx);
        this.$entities.clear();
    }

    onUpdateEntities(entitiesData: NetData[]) {
        for (const data of entitiesData) {
            if (this.$entities.has(data.id)) this.$entities.get(data.id)!.updateByServer(data);
            else this.createEntity(data);
        }
    }
    
    protected onTick(): void {
        this.$ctx.clear('black');
        this.$area?.update();
        this.$area?.draw(this.$camera);
        
        for (const [id, entity] of this.$entities) {
            entity.update();
            if (entity.isDestroyed) this.$entities.delete(id);
            else entity.draw(this.$camera);
        }
    }

    protected onStart(): void {
        this.$sendInputsInterval = window.setInterval(this.sendInputs.bind(this), 1000 / 60);
    }

    protected onStop(): void {
        clearInterval(this.$sendInputsInterval);
    }

    createEntity(data: NetData) {
        switch (data.entityType) {
            case EntityTypes.PLAYER:
                const player = new Player(data as PlayerNetData, this.$ctx);
                if (player.id == this.$gameConfig?.playerId) {
                    this.$self = player;
                    this.$camera.startFollow(player.position);
                }
                this.$entities.set(data.id, player);
                break;
            case EntityTypes.BULLET:
                const bullet = new Bullet(data as BulletNetData, this.$ctx);
                this.$entities.set(data.id, bullet);
                break;
        }
    }

    sendInputs() {
        const input = this.$inputsController.input;
        if (this.$inputsController.isUpdated || input.keyboard.top || input.keyboard.down || input.keyboard.left || input.keyboard.right || input.mouse.shot) {
            this.$inputsController.isUpdated = false;
            this.$game.socket.send(MessagesTypes.PLAYER_INPUT, input);
        }
    }
}
