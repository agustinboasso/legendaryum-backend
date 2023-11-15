"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaverseController = void 0;
class MetaverseController {
    constructor(metaverseService) {
        this.metaverseService = metaverseService;
    }
    getCoinsInRoom(req, res) {
        const roomName = req.params.room;
        const coins = this.metaverseService.getCoinsInRoom(roomName);
        res.json(coins);
    }
    grabCoin(req, res) {
        const coinId = req.params.id;
        this.metaverseService.removeCoin(coinId);
        // Implementar lógica para informar a todos los clientes sobre la moneda agarrada
        res.sendStatus(204);
    }
    getRooms(req, res) {
        const rooms = this.metaverseService.getRooms();
        res.json(rooms);
    }
}
exports.MetaverseController = MetaverseController;
