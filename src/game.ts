import GameRenderer from "./renderers/gameRenderer";
import { MessagesTypes, Socket } from "./socket";
import { GameConfig, SocketServerMessage } from "./socket/types";
import { NetData } from "./types/netData";

export default class Game {
    private $gameRenderer: GameRenderer;
    get gameRenderer() { return this.$gameRenderer }

    private $socket: Socket;
    get socket() { return this.$socket }

    constructor() {
        this.$gameRenderer = new GameRenderer(this);
        this.$socket = new Socket('ws://127.0.0.1:5000/server', this.onSocketOpen.bind(this), this.onSocketConnect.bind(this), this.onSocketMessage.bind(this));
    }
    
    onSocketOpen() {
        this.$socket.send(MessagesTypes.PLAYER_READY);
    }

    onSocketConnect() {
        this.$socket.send(MessagesTypes.PLAYER_CONFIG);
    }
    
    private $lastPsgTime: number = 0;
    onSocketMessage(message: SocketServerMessage) {
        switch (message.type) {
            case MessagesTypes.GAME_CONFIG:
                console.log(message.data)
                this.$gameRenderer.onGameConfig(message.data as GameConfig);
                this.$gameRenderer.start();
                break;
            
            case MessagesTypes.UPDATE_ENTITIES:
                // console.log(Date.now() - this.$lastPsgTime);
                this.$lastPsgTime = Date.now();
                this.$gameRenderer.onUpdateEntities(message.data as NetData[]);
                break;
        }
    }
}
